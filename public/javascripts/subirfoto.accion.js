// Subir foto
const preview_foto = document.getElementById('preview-foto');
const input_foto_perfil = document.getElementById('foto');

input_foto_perfil.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (eventFR) => {
        preview_foto.src = eventFR.target.result;
    }
});