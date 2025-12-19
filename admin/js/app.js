// Check Authentication
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        // Load data only after auth is confirmed
        // We only load data if we are on the content page or dashboard with the form
        if (document.getElementById('contentTabs') || document.getElementById('heroForm')) {
            loadAllContent();
        } else if (document.getElementById('index-stats')) {
             // Dashboard stats placeholders
        }
    }
});

// Logout
if(document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            window.location.href = 'login.html';
        });
    });
}

// Sidebar Toggle (Mobile)
const sidebarToggle = document.getElementById('sidebarToggle');
if(sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
}

// ==========================================
// Data Management
// ==========================================

const contentRef = db.collection('site_content');

async function loadAllContent() {
    console.log("Loading all content...");
    const loader = document.getElementById('adminLoader');
    if (loader) loader.classList.remove('d-none');
    
    const promises = [];

    // 1. Load Home Data
    promises.push(contentRef.doc('home').get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            setVal('heroTitle', data.heroTitle);
            setVal('heroSubtitle', data.heroSubtitle);
            setVal('heroBadge', data.heroBadge);
            setVal('statClients', data.statClients);
            setVal('statCompanies', data.statCompanies);
            setVal('statLicenses', data.statLicenses);
            setVal('statYears', data.statYears);
            setVal('homeBannerUrl', data.bannerUrl);
        }
    }));

    // 2. Load About Data
    promises.push(contentRef.doc('about').get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            setVal('aboutHeroTitle', data.heroTitle);
            setVal('aboutMainTitle', data.mainTitle);
            setVal('aboutText', data.mainText);
            setVal('aboutImgUrl', data.mainImgUrl);
            setVal('aboutBannerUrl', data.bannerUrl);
        }
    }));

    // 3. Load Services Data
    promises.push(contentRef.doc('services').get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            setVal('serviceHeroTitle', data.heroTitle);
            setVal('serviceBannerUrl', data.bannerUrl);
        }
    }));

    // 4. Load Contact Data
    promises.push(contentRef.doc('contact').get().then(doc => {
        if(doc.exists) {
             const data = doc.data();
             setVal('contactHeroTitle', data.heroTitle);
             setVal('contactHeroSubtitle', data.heroSubtitle);
             setVal('contactBannerUrl', data.bannerUrl);
        }
    }));

    // 5. Load Global Data
    promises.push(contentRef.doc('global').get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            setVal('globalPhone', data.phone);
            setVal('globalEmail', data.email);
            setVal('globalAddress', data.address);
            setVal('footerDesc', data.footerDesc);
            setVal('footerCopyright', data.copyright);
        }
    }));

    // 6. Load Services List
    promises.push(loadServicesList());

    try {
        await Promise.all(promises);
        console.log("All content loaded.");
    } catch (error) {
        console.error("Error loading content:", error);
        // alert("Error loading data. Check console for details.");
    } finally {
        if (loader) loader.classList.add('d-none');
    }
}

// Helper to safely set value
function setVal(id, val) {
    const el = document.getElementById(id);
    if(el && val !== undefined) el.value = val;
}

// ==========================================
// Service List Management
// ==========================================
const servicesRef = db.collection('services_list');
let serviceModal; // Bootstrap modal instance

function loadServicesList() {
    return servicesRef.orderBy('order').get().then(snapshot => {
        const tbody = document.getElementById('servicesListTable');
        if(!tbody) return;
        
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const s = doc.data();
            const id = doc.id;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.order || 0}</td>
                <td><i class="fa ${s.icon} fa-lg text-primary"></i> <small class="text-muted">${s.icon}</small></td>
                <td>
                    <strong>${s.title}</strong><br>
                    <small class="text-muted">${s.desc ? s.desc.substring(0, 50) + '...' : ''}</small>
                </td>
                <td>
                    <button class="btn btn-sm btn-info text-white me-1" onclick="openServiceModal('${id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteService('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }).catch(err => console.error("Error loading services list:", err));
}

window.openServiceModal = function(id = null) {
    // Initialize modal if not already done
    if(!serviceModal) {
        const modalEl = document.getElementById('serviceModal');
        if(modalEl) serviceModal = new bootstrap.Modal(modalEl);
    }
    
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceTitle').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('serviceIcon').value = '';
    document.getElementById('serviceOrder').value = '0';
    document.getElementById('serviceModalLabel').innerText = 'Add New Service';

    if(id) {
        document.getElementById('serviceModalLabel').innerText = 'Edit Service';
        servicesRef.doc(id).get().then(doc => {
            if(doc.exists) {
                const d = doc.data();
                document.getElementById('serviceId').value = id;
                document.getElementById('serviceTitle').value = d.title;
                document.getElementById('serviceDesc').value = d.desc;
                document.getElementById('serviceIcon').value = d.icon;
                document.getElementById('serviceOrder').value = d.order;
                serviceModal.show();
            }
        });
    } else {
        if(serviceModal) serviceModal.show();
    }
}

// Service Form Submit
if(document.getElementById('serviceItemForm')) {
    document.getElementById('serviceItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('serviceId').value;
        const data = {
            title: document.getElementById('serviceTitle').value,
            desc: document.getElementById('serviceDesc').value,
            icon: document.getElementById('serviceIcon').value,
            order: parseInt(document.getElementById('serviceOrder').value) || 0,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let promise;
        if(id) {
            promise = servicesRef.doc(id).update(data);
        } else {
            promise = servicesRef.add(data);
        }

        promise.then(() => {
            if(serviceModal) serviceModal.hide();
            loadServicesList();
            alert('Service saved successfully!');
        }).catch(err => {
            alert('Error saving service: ' + err.message);
        });
    });
}

window.deleteService = function(id) {
    if(confirm('Are you sure you want to delete this service?')) {
        servicesRef.doc(id).delete().then(() => {
            loadServicesList();
        }).catch(err => alert('Error deleting: ' + err.message));
    }
}


// ==========================================
// Save Handlers
// ==========================================

// Save Home
if(document.getElementById('heroForm')) {
    document.getElementById('heroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoc('home', {
            heroTitle: getVal('heroTitle'),
            heroSubtitle: getVal('heroSubtitle'),
            heroBadge: getVal('heroBadge'),
            statClients: getVal('statClients'),
            statCompanies: getVal('statCompanies'),
            statLicenses: getVal('statLicenses'),
            statYears: getVal('statYears'),
            bannerUrl: getVal('homeBannerUrl'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, e.target);
    });
}

// Save About
if(document.getElementById('aboutForm')) {
    document.getElementById('aboutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoc('about', {
            heroTitle: getVal('aboutHeroTitle'),
            mainTitle: getVal('aboutMainTitle'),
            mainText: getVal('aboutText'),
            mainImgUrl: getVal('aboutImgUrl'),
            bannerUrl: getVal('aboutBannerUrl'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, e.target);
    });
}

// Save Services
if(document.getElementById('serviceForm')) {
    document.getElementById('serviceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoc('services', {
            heroTitle: getVal('serviceHeroTitle'),
            bannerUrl: getVal('serviceBannerUrl'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, e.target);
    });
}

// Save Contact
if(document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoc('contact', {
            heroTitle: getVal('contactHeroTitle'),
            heroSubtitle: getVal('contactHeroSubtitle'),
            bannerUrl: getVal('contactBannerUrl'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, e.target);
    });
}

// Save Global
if(document.getElementById('globalForm')) {
    document.getElementById('globalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoc('global', {
            phone: getVal('globalPhone'),
            email: getVal('globalEmail'),
            address: getVal('globalAddress'),
            footerDesc: getVal('footerDesc'),
            copyright: getVal('footerCopyright'),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, e.target);
    });
}

// Helper to get value
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

// Generic Save Function
function saveDoc(docName, data, form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Saving...';
    btn.disabled = true;

    contentRef.doc(docName).set(data, { merge: true })
        .then(() => {
            alert('Updated successfully!');
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            alert('Error updating: ' + error.message);
            btn.innerText = originalText;
            btn.disabled = false;
        });
}
