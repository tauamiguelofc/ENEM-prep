// Alternar tema escuro
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Função para carregar aulas ao clicar na sidebar
function carregarAula(aula) {
    const aulas = {
        'raizes': {titulo: 'Raízes Quadradas', video: 'https://youtu.be/-X5zHFi7MIg?si=7TtQbN7CZTVVcUNR', descricao: '<h1>Ut aspernatur galisum aut rerum nobis! </h1><p>Lorem ipsum dolor sit amet. Et facere incidunt <strong>Aut debitis est alias quia aut consectetur ratione</strong> sed iure rerum. Qui autem blanditiis non quasi oditnam eius. Et dignissimos eiusAt asperiores sed magnam molestiae qui sequi vero non dignissimos assumenda aut eveniet laudantium. Qui eveniet similiqueRem veritatis est doloremque nesciunt ea mollitia dicta est exercitationem optio ut ullam autem. Hic nisi tenetur <em>Aut delectus non distinctio omnis eum dolor aperiam et dolorem modi</em> et quis magnam et praesentium alias. </p><ul><li>Et ipsa quia et voluptatem labore. </li><li>Ex necessitatibus error et voluptatem sunt ut nemo maxime? </li><li>Qui accusantium sint non expedita doloremque est rerum voluptatem. </li><li>In quia incidunt et voluptatum inventore est dolor officiis! </li></ul><h2>Ut galisum quaerat aut tempore velit ab laboriosam dolore. </h2><p>Et consequatur dolores aut doloremque voluptatemin esse ex rerum nulla est voluptatem dolor? Ex facilis minima <em>Ut eligendi At sunt rerum et dolor iure</em> sed esse eligendi et autem aspernatur. Qui ipsam voluptatum est soluta nobisRem numquam est sint iure qui explicabo veritatis ut ullam quisquam. Et vero mollitiaEt deleniti et aliquid ratione et tempora libero sit accusantium totam? Non voluptatem similique ut odit mollitiaIn repellat 33 galisum nesciunt in omnis maxime aut deserunt veritatis. </p><h3>Non deleniti possimus id provident velit quo maiores rerum. </h3><p>Rem quia doloribusVel laborum sit cumque odit non beatae alias et voluptatem molestiae a asperiores amet a odio officia. Qui iusto temporaAut consequuntur id aspernatur veniam aut nobis suscipit aut voluptatem eaque et dicta galisum. Qui voluptas aspernatur <a href="https://www.loremipzum.com" target="_blank">Ea porro quo fugiat ipsam id maxime rerum</a> hic perferendis numquam et architecto officia. Qui minima officia sit culpa quasSed voluptatum et dolor dolores est nostrum laudantium est fugit facere. Et nobis eius <em>Et illum est velit iste id facilis quis</em> non esse sint! Non nisi sequi33 praesentium qui voluptatibus dolores ut omnis suscipit et odit velit aut itaque dolor. Ab voluptates vitae <strong>Est consequuntur et provident vero aut minus placeat</strong>. </p>
'},
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
