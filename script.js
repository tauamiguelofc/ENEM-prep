// Alternar tema escuro
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Função para carregar aulas ao clicar na sidebar
function carregarAula(aula) {
    const aulas = {
        raizes: {
            titulo: 'Raízes Quadradas',
            video: 'https://www.youtube.com/embed/-X5zHFi7MIg?si=7TtQbN7CZTVVcUNR',
            descricao: `Lorem ipsum dolor sit amet. Et fugiat perspiciatis et reprehenderit saepe non dolorum necessitatibus ad nisi ratione qui ullam totam.
            Et quas dolores aut animi incidunt eum laudantium cupiditate. Ab nihil omnis et iure asperiores et quidem quisquam.
            Vel magni culpa non enim voluptates qui repellat nostrum est atque architecto qui iste suscipit quo ducimus quae qui dolores illum!
            Aut galisum incidunt qui quia quia sed beatae veritatis a voluptas sequi rem optio autem.
            Est deleniti magnam et cumque dolorum et atque nesciunt eos animi voluptatem qui voluptas nisi ut nobis nihil qui expedita eligendi.
            Sit temporibus fugiat est officiis vero quo nostrum totam.
            Hic eveniet quia et quia rerum sit esse alias.
            Aut rerum galisum rem voluptatum totam nam molestias eveniet.
            Non molestiae voluptatum ut nisi exercitationem ut maiores dolore.`
        },
        equacoes: {
            titulo: 'Equações',
            video: 'https://www.youtube.com/embed/VIDEO_ID2',
            descricao: 'Entenda a solução de equações do primeiro grau.'
        },
        algebra: {
            titulo: 'Álgebra',
            video: 'https://www.youtube.com/embed/VIDEO_ID3',
            descricao: 'Explore conceitos fundamentais de álgebra.'
        },
        somas: {
            titulo: 'Somas',
            video: 'https://www.youtube.com/embed/VIDEO_ID4',
            descricao: 'Descubra as principais propriedades das somas.'
        }
    };

    const aulaSelecionada = aulas[aula];
    if (!aulaSelecionada) return;

    document.getElementById('titulo-aula').innerText = aulaSelecionada.titulo;
    document.getElementById('video-aula').src = aulaSelecionada.video;
    document.getElementById('descricao-aula').innerText = aulaSelecionada.descricao;
    document.getElementById('baixar-material').href = `materiais/${aula}.pdf`;
}

// Webhook para Reclamações no Discord
document.getElementById('reclameForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !mensagem) {
        alert('Preencha todos os campos antes de enviar.');
        return;
    }

    try {
        const response = await fetch('/enviar-reclamacao', { // rota segura no backend
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nome, mensagem })
        });

        if (!response.ok) throw new Error('Erro no envio.');

        alert('Mensagem enviada com sucesso!');
        document.getElementById('reclameForm').reset();
    } catch (err) {
        console.error(err);
        alert('Falha ao enviar mensagem. Tente novamente mais tarde.');
    }
});
