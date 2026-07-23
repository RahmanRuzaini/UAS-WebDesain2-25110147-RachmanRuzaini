function pindahHalaman(namaHalaman, keKeranjang = false) {
    document.querySelectorAll('.page-view').forEach(function (el) {
        el.classList.remove('active');
    });

    const targetNama = namaHalaman === 'menu-keranjang' ? 'menu' : namaHalaman;
    const target = document.getElementById('page-' + targetNama);

    if (target) {
        target.classList.add('active');
    }

    document.querySelectorAll('.nav-link-page').forEach(function (link) {
        const isActive = link.getAttribute('data-page') === targetNama;
        link.classList.toggle('active', isActive);
    });

    // auto-scroll otomatis
    if (keKeranjang || namaHalaman === 'menu-keranjang') {
        const sectionKeranjang = document.getElementById('section-keranjang');
        if (sectionKeranjang) {
            sectionKeranjang.scrollIntoView({ behavior: 'smooth' }); //bergulir dengan mulus ke tabel keranjang
        }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Tutup otomatis menu navbar pada tampilan HP
    if (typeof $ !== 'undefined' && $('#navbarLinks').length) {
        $('#navbarLinks').collapse('hide');
    }
}

// Menambahkan event klik pada seluruh tombol/link yang memiliki atribut 'data-page'
document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const halaman = this.getAttribute('data-page');
        pindahHalaman(halaman);
    });
});

/* SECTION 1: HOME FUNCTIONS */
// slide auto play
$(document).ready(function() {
    $('#homeCarousel').carousel({
        interval: 3500,
        pause: "hover"
    });
});

/* SECTION 2: MENU & KERANJANG FUNCTIONS */
// Mengubah jumlah porsi pada item menu (- / +)
function ubahQty(button, delta) {
    const inputGroup = button.closest('.qty-control');
    const inputQty = inputGroup.querySelector('.input-qty');
    let currentValue = parseInt(inputQty.value) || 1;
// +/- Tidak bisa kurang dari 1
    currentValue += delta;
    if (currentValue < 1) currentValue = 1;
    
    inputQty.value = currentValue;
}

/* Memperbarui badge angka merah pada ikon keranjang di navbar atas */
function updateJumlahKeranjangNavbar() {
    const tbody = document.getElementById('tabel-keranjang');
    const countBadge = document.getElementById('cart-count');
    if (tbody && countBadge) {
        const jumlahItem = tbody.querySelectorAll('tr').length;
        countBadge.innerText = jumlahItem;
    }
}

// Menambahkan item ke tabel keranjang
document.querySelectorAll('.btn-beli').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cardBody = this.closest('.card-body');
        const namaMenu = cardBody.querySelector('.font-weight-bold.text-danger').innerText;
        const hargaTeks = cardBody.querySelector('.harga-menu').innerText;
        
        const inputQty = cardBody.querySelector('.input-qty');
        const porsi = parseInt(inputQty ? inputQty.value : 1);
        
        const hargaAngka = parseInt(hargaTeks.replace(/[^0-9]/g, '')) || 0;
        const totalHargaItem = hargaAngka * porsi;
        const totalHargaFormatted = "Rp " + totalHargaItem.toLocaleString('id-ID');

        const tbody = document.getElementById('tabel-keranjang');
        if (tbody) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><strong>${namaMenu}</strong> <span class="badge badge-warning text-dark ml-1">${porsi} Porsi</span></td>
                <td>${totalHargaFormatted}</td>
                <td class="text-center">
                    <button class="btn-batal" onclick="batalBeli(this)">Batal</button>
                </td>
            `;
            
            tbody.appendChild(row);
            if (inputQty) inputQty.value = 1; 
            
            updateJumlahKeranjangNavbar();
            alert(`${namaMenu} (${porsi} Porsi) telah ditambahkan ke Pesanan Anda!`);
        }
    });
});

/* Menghapus item dari keranjang */
function batalBeli(button) {
    button.closest('tr').remove();
    updateJumlahKeranjangNavbar();
}

/* isi keranjang ke pesanan WA*/
function prosesPesanSemua() {
    const tbody = document.getElementById('tabel-keranjang');
    const rows = tbody.querySelectorAll('tr');

    if (rows.length === 0) {
        alert("Pesanan Anda masih kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }

    let daftarPesanan = [];
    let totalHarga = 0;

    rows.forEach((row, index) => {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 2) {
            const detailMenu = cols[0].innerText.trim();
            const hargaTeks = cols[1].innerText.trim();
            
            const hargaAngka = parseInt(hargaTeks.replace(/[^0-9]/g, '')) || 0;
            totalHarga += hargaAngka;

            daftarPesanan.push(`${index + 1}. ${detailMenu} = ${hargaTeks}`);
        }
    });
    const totalFormatted = "Rp " + totalHarga.toLocaleString('id-ID');


    const rangkumanPesan = `Halo Lesehan Om Jun, saya mau pesan:\n` +
                           `-----------------------------------\n` +
                           daftarPesanan.join('\n') +
                           `\n-----------------------------------\n` +
                           `*Total Pembayaran: ${totalFormatted}*`;

    // Berpindah ke Halaman Kontak & isi Otomatis Form WhatsApp
    pindahHalaman('kontak');

    const inputPesan = document.getElementById('inputPesan');
    if (inputPesan) {
        inputPesan.value = rangkumanPesan;
        inputPesan.style.height = 'auto';
        inputPesan.style.height = (inputPesan.scrollHeight + 10) + 'px';

        //Kursor langsung ke isi Nama
        const inputNama = document.getElementById('inputNama');
        if (inputNama) inputNama.focus();
    }
}

/* SECTION 4: KONTAK FUNCTIONS (INTEGRASI WHATSAPP) */

const formWA = document.getElementById('formWhatsApp');
if (formWA) {
    formWA.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('inputNama').value.trim();
        const pesan = document.getElementById('inputPesan').value.trim();
        const nomorWA = "6285363817372";
        
        //Jika nama masih kosong
        if (!nama) {
            alert("Silakan masukkan Nama Lengkap Anda terlebih dahulu!");
            return;
        }

        const teksFormat = `Halo Lesehan Om Jun,%0A%0ASaya *${encodeURIComponent(nama)}*%0A%0A*Detail Pesanan:*%0A${encodeURIComponent(pesan)}`;

        window.open(`https://wa.me/${nomorWA}?text=${teksFormat}`, '_blank');
    });
}
