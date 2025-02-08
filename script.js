// Alternar tema escuro
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Função para carregar aulas ao clicar na sidebar
function carregarAula(aula) {
    const aulas = {
        'raizes': {titulo: 'Raízes Quadradas', video: 'https://www.youtube.com/embed/VIDEO_ID1', descricao: 'Aprenda sobre raízes quadradas.'},
        'equacoes': {titulo: 'Equações', video: 'https://www.youtube.com/embed/VIDEO_ID2', descricao: 'Entenda a solução de equações do primeiro grau.'},
        'algebra': {titulo: 'Álgebra', video: 'https://www.youtube.com/embed/VIDEO_ID3', descricao: 'Explore conceitos fundamentais de álgebra.'},
        'somas': {titulo: 'Somas', video: 'https://www.youtube.com/embed/VIDEO_ID4', descricao: 'Descubra as principais propriedades das somas.'},
    };

    if (aulas[aula]) {
        document.getElementById('titulo-aula').innerText = aulas[aula].titulo;
        document.getElementById('video-aula').src = aulas[aula].video;
        document.getElementById('descricao-aula').innerText = aulas[aula].descricao;
        document.getElementById('baixar-material').href = `materiais/${aula}.pdf`;
    }
}

// Webhook para Reclamações no Discord
document.getElementById('reclameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;

    fetch('https://discord.com/api/webhooks/1222733165395837009/nQxy-tWh-_0jBx5RIs8bKr_rz6NiOetPfO4VdaZeUIEZ1k5H4UiUziRziJpeChHYfLmc', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content: `**${nome}**: ${mensagem}`})
    });

    alert("Mensagem enviada!");
});
