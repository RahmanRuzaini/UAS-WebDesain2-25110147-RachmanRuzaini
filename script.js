function pindahHalaman(namaHalaman) {
    document.querySelectorAll('.page-view').forEach(function (el) {
        el.classList.remove('active');
    });

    const target = document.getElementById('page-' + namaHalaman);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link-page').forEach(function (link) {
        const isActive = link.getAttribute('data-page') === namaHalaman;
        link.classList.toggle('active', isActive);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    $('#navbarLinks').collapse('hide');
}

document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        pindahHalaman(this.getAttribute('data-page'));
    });
});

document.querySelectorAll('.btn-beli').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cardBody = this.closest('.card-body');
        const namaMenu = cardBody.querySelector('.font-weight-bold.text-danger').innerText;
        const hargaMenu = cardBody.querySelector('.card-footer-custom span').innerText;
        
        const tbody = document.getElementById('tabel-keranjang');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${namaMenu}</td>
            <td>${hargaMenu}</td>
            <td class="text-center">
                <button class="btn-batal" onclick="batalBeli(this)">Batal</button>
                <button class="btn-pesan" onclick="prosesPesan('${namaMenu}')">Pesan</button>
            </td>
        `;
        
        tbody.appendChild(row);
        alert(`${namaMenu} berhasil dimasukkan ke Pesanan!`);
    });
});

function batalBeli(button) {
    button.closest('tr').remove();
}

function prosesPesan(namaMenu) {
    alert(`Pesanan untuk ${namaMenu} sedang diproses! Terima kasih.`);
}





/*wa*/

const formWA = document.getElementById('formWhatsApp');
if (formWA) {
    formWA.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('inputNama').value;
        const pesan = document.getElementById('inputPesan').value;
        
        // Format teks untuk WhatsApp (menggunakan %0A untuk baris baru)
        const teksFormat = `Halo Lesehan Om Jun,%0A%0ASaya *${nama}*%0A%0A*Pesan:*%0A${pesan}`;
        
        // Mengarahkan ke API WhatsApp dengan nomor tujuan anda
        const nomorWA = "6285363817372"; 
        window.open(`https://wa.me/${nomorWA}?text=${teksFormat}`, '_blank');
    });
}