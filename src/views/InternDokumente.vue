<template>
  <div class="dokumente">
    <!-- Upload area (admin only) -->
    <div v-if="isAdmin" class="upload-area card">
      <div
        class="dropzone"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleDrop"
      >
        <span class="upload-icon">📤</span>
        <p>Datei hierhin ziehen oder <label class="file-label">
          <input type="file" @change="handleFileSelect" multiple hidden />
          durchsuchen
        </label></p>
      </div>

      <div v-if="uploading" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>
    </div>

    <!-- Documents list -->
    <div v-if="documents.length > 0" class="docs-list">
      <div class="docs-header">
        <h3>Dokumente ({{ documents.length }})</h3>
      </div>

      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hochgeladen</th>
              <th>Grösse</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id" class="doc-row">
              <td>
                <div class="doc-name">
                  <span class="doc-icon">{{ getFileIcon(doc.name) }}</span>
                  <span>{{ doc.name }}</span>
                </div>
              </td>
              <td class="doc-meta">{{ formatDate(doc.uploadedAt) }}</td>
              <td class="doc-meta">{{ formatSize(doc.size) }}</td>
              <td>
                <div class="doc-actions">
                  <button @click="downloadDocument(doc)" class="action-btn download">↓</button>
                  <button v-if="isAdmin" @click="deleteDocument(doc)" class="action-btn delete">×</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📁</span>
      <p>Noch keine Dokumente vorhanden.</p>
      <p v-if="isAdmin" style="margin-top: 0.5rem; font-size: 0.85rem;">
        Lade Dokumente hoch mit dem Bereich oben.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc as firestoreDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../composables/useAuth'

const MAX_FILE_SIZE = 700 * 1024 // ~700KB limit (Firestore doc limit is 1MB, base64 adds ~33%)

const { isAdmin } = useAuth()

const documents = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)
const dragging = ref(false)

onMounted(async () => {
  await loadDocuments()
})

async function loadDocuments() {
  try {
    const q = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'))
    const snap = await getDocs(q)
    documents.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    documents.value = []
  }
}

function handleDrop(e) {
  dragging.value = false
  const files = e.dataTransfer.files
  if (files.length) uploadFiles(files)
}

function handleFileSelect(e) {
  const files = e.target.files
  if (files.length) uploadFiles(files)
}

async function uploadFiles(files) {
  for (const file of files) {
    await uploadFile(file)
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        uploadProgress.value = Math.round((e.loaded / e.total) * 100)
      }
    }
    reader.readAsDataURL(file)
  })
}

async function uploadFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    alert(`"${file.name}" ist zu gross (max. 700 KB). Bitte eine kleinere Datei wählen.`)
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    const base64 = await fileToBase64(file)

    await addDoc(collection(db, 'documents'), {
      name: file.name,
      data: base64,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })

    await loadDocuments()
  } catch (err) {
    console.error('Upload error:', err)
    alert('Fehler beim Hochladen. Bitte versuche es erneut.')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

function downloadDocument(document) {
  const link = document.createElement ? document.createElement('a') : window.document.createElement('a')
  const a = window.document.createElement('a')
  a.href = document.data
  a.download = document.name
  a.click()
}

async function deleteDocument(document) {
  if (!confirm(`"${document.name}" wirklich löschen?`)) return

  try {
    await deleteDoc(firestoreDoc(db, 'documents', document.id))
    await loadDocuments()
  } catch (err) {
    console.error('Delete error:', err)
  }
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  const icons = {
    pdf: '📕',
    doc: '📘', docx: '📘',
    xls: '📗', xlsx: '📗',
    ppt: '📙', pptx: '📙',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️',
    zip: '📦', rar: '📦',
    txt: '📝', md: '📝',
  }
  return icons[ext] || '📄'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
/* Upload */
.upload-area {
  margin-bottom: 2rem;
  padding: 0;
  overflow: hidden;
}

.dropzone {
  padding: 2.5rem 2rem;
  text-align: center;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  transition: all var(--transition);
  cursor: pointer;
  margin: 1rem;
}

.dropzone.dragging {
  border-color: var(--color-primary);
  background: rgba(30, 95, 170, 0.04);
}

.upload-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.dropzone p {
  font-size: 0.9rem;
}

.file-label {
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 500;
}

.file-label:hover {
  text-decoration: underline;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-surface);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 40px;
}

/* Documents table */
.docs-list {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.docs-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.docs-header h3 {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.docs-table-wrap {
  overflow-x: auto;
}

.docs-table {
  width: 100%;
  border-collapse: collapse;
}

.docs-table th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.docs-table td {
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.doc-row:last-child td {
  border-bottom: none;
}

.doc-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.doc-icon {
  font-size: 1.25rem;
}

.doc-meta {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  transition: all var(--transition);
  text-decoration: none;
}

.action-btn.download:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(30, 95, 170, 0.06);
}

.action-btn.delete:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(198, 40, 40, 0.06);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 0.95rem;
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .docs-table th:nth-child(3),
  .docs-table td:nth-child(3) {
    display: none;
  }
}
</style>
