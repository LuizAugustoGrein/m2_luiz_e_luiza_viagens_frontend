const APICredentials = {
    email: "luiza@gmail.com",
    password: "123456"
}

var apiToken = null;

async function authenticate () {
    $.ajax({
        type: "GET",
        url: 'http://localhost:5000/authenticate',
        success: (data) => {
            apiToken = data
        },
        error: (data) => {
            console.log(data)
        }
    });
}

authenticate();

$('#show-all-trips').on('click', function () {
    $('#show-users-trips').removeClass('active');
    $(this).addClass('active');

    $('.main-title').text('Todas as viagens');

    $('#head-trips').html('');
    $('#head-trips').append(`
        <tr>
            <th scope="col">ID Usuário</th>
            <th scope="col">Nome</th>
            <th scope="col">Estado</th>
            <th scope="col">Ano</th>
        </tr>
    `);

    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/api/trips',
        headers: {
            "x-access-token": apiToken
        },
        success: (data) => {
            $('#body-trips').html('');
            data.forEach(element => {
                $('#body-trips').append(
                    `<tr>
                        <td>${element.usuario}</td>
                        <td>${element.nome}</td>
                        <td>${element.estado}</td>
                        <td>${element.ano}</td>
                    </tr>`
                )
            });
        },
        error: (data) => {
            console.log(data)
        }
    });

})

$('#show-users-trips').on('click', function () {
    $('#show-all-trips').removeClass('active');
    $(this).addClass('active');

    $('.main-title').text('Viagens por usuários');

    $('#head-trips').html('');
    $('#head-trips').append(`
        <tr>
            <th scope="col">ID Usuário</th>
            <th scope="col">Nome</th>
            <th scope="col">#</th>
        </tr>
    `);

    var users = [];

    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/api/trips',
        headers: {
            "x-access-token": apiToken
        },
        success: (data) => {
            $('#body-trips').html('');

            data.forEach(element => {
                var userExists = false
                var userData = {};
                users.forEach(user => {
                    if (element.usuario == user.usuario) {
                        userExists = true;
                    } else {
                        userData = element;
                    }
                })
                if (!userExists) {
                    users.push({
                        usuario: element.usuario,
                        nome: element.nome
                    });
                }
            });
            users.forEach(element => {
                $('#body-trips').append(
                    `<tr>
                        <td>${element.usuario}</td>
                        <td>${element.nome}</td>
                        <td><button class="see-trips btn btn-success" data-id=${element.usuario}>Ver Viagens</button></td>
                    </tr>`
                )
            });
            verifyClick();
        },
        error: (data) => {
            console.log(data)
        }
    });
})

function verifyClick() {
    $('.see-trips').on('click', function () {
        $('#show-all-trips').removeClass('active');
        $(this).addClass('active');
    
        $('#head-trips').html('');
        $('#head-trips').append(`
            <tr>
                <th scope="col">Estado</th>
                <th scope="col">Ano</th>
            </tr>
        `);
    
        var users = [];

        var userID = $(this).data('id');

        $.ajax({
            type: "GET",
            url: 'http://localhost:3000/api/trips/' + userID,
            headers: {
                "x-access-token": apiToken
            },
            success: (data) => {
                $('#body-trips').html('');
                data.forEach(element => {
                    $('.main-title').text('Viagens cadastradas de ' + element.nome);
                    $('#body-trips').append(
                        `<tr>
                            <td>${element.estado}</td>
                            <td>${element.ano}</td>
                        </tr>`
                    )
                });
            },
            error: (data) => {
                console.log(data)
            }
        });
    })
}

