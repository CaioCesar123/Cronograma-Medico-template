window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    const userName = sessionStorage.getItem('userNome');
    if (userName) {
        document.getElementById('userlogName').textContent = userName;
    } else {
        window.location.href = 'login.html';
    }

    ListPaciente();
});

document.getElementById('logOut').addEventListener('click', function (event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.href = 'login.html';
});

async function ListPaciente() {
    debugger
    try {
        const userId = sessionStorage.getItem('userId');
        const url = `http://127.0.0.1:5000/paciente?idUser=${userId}`;
        const response = await fetch(url, {
            method: 'get',
        });

        const data = await response.json();
        populateTable(data.pacientes);

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function populateTable(pacientes) {
    const tableElement = document.getElementById('TablePaciente');
    if (tableElement) {

        if (tableElement.dataTable) {
            tableElement.dataTable.destroy();
        }

        const tableData = pacientes.map(paciente => [
            paciente.nome,
            new Date(paciente.data).toISOString().substring(0, 16).replace('T', ' '),
            paciente.doenca,
            paciente.notas,
            `<button class="btn btn-primary" onclick="editPaciente(${paciente.id}, '${paciente.nome}', '${paciente.doenca}', '${formatarDataParaParametro(paciente.data)}', '${paciente.notas}')">Editar</button>
            <button class="btn btn-danger" onclick="deletePaciente(${paciente.id})">Deletar</button>
            <button class="btn btn-info" onclick="listReceita(${paciente.id})">Receitas</button>`
        ]);


        const dataTable = new simpleDatatables.DataTable(tableElement, {
            data: {
                headings: ["Nome", "Data da Consulta", "Sintomas", "Observação", "Controler"],
                data: tableData
            }
        });

        tableElement.dataTable = dataTable;
    }
}

function formatarDataParaParametro(data) {
    const dataObj = new Date(data);
    return dataObj.toISOString();
}


function editPaciente(id, nome, doenca, data, notas) {
    $('#editPacienteModal').modal('show');
    document.getElementById('editPacienteNome').value = nome;
    document.getElementById('editPacienteData').value = new Date(data).toISOString().substring(0, 16);
    document.getElementById('editPacienteDoenca').value = doenca;
    document.getElementById('editPacienteNotas').value = notas;
    document.getElementById('editPacienteId').value = id;
}

async function deletePaciente(id) {
    const formData = new FormData()
    formData.append('idPaciente', id)

    const url = `http://127.0.0.1:5000/paciente/delete`;
    const response = await fetch(url, {
        method: 'delete',
        body: formData
    });

    if (response.ok) {
        ListPaciente()
    } else {
        alert("Erro ao deletar o paciente")
    }
}

function refreshPage() {
    location.reload();
}

function newPaciente() {
    $('#createPacienteModal').modal('show');

}

function closeModal() {
    $('#createPacienteModal').modal('hide');
    $('#editPacienteModal').modal('hide');
    $('#receitasModal').modal('hide');
}

async function savePaciente() {
    const nome = document.getElementById('createPacienteNome').value;
    const dataConsulta = document.getElementById('createPacienteDataConsulta').value;
    const sintomas = document.getElementById('createPacienteSintomas').value;
    const notas = document.getElementById('createPacienteNotas').value;
    const id = sessionStorage.getItem('userId');
    const formData = new FormData()
    formData.append('dataConsulta', dataConsulta)
    formData.append('doenca', sintomas)
    formData.append('nome', nome)
    formData.append('notas', notas)
    formData.append('userID', id)

    const url = `http://127.0.0.1:5000/paciente/create`;
    const response = await fetch(url, {
        method: 'post',
        body: formData
    });

    if (response.ok) {
        $('#createPacienteModal').modal('hide');
        refreshPage();
    } else {
        alert("Erro ao criar o paciente")
    }
}

async function saveUpdatePaciente() {
    const nome = document.getElementById('editPacienteNome').value;
    const dataConsulta = document.getElementById('editPacienteData').value;
    const sintomas = document.getElementById('editPacienteDoenca').value;
    const notas = document.getElementById('editPacienteNotas').value;
    const id = document.getElementById('editPacienteId').value;
    const formData = new FormData()
    formData.append('dataConsulta', dataConsulta)
    formData.append('doenca', sintomas)
    formData.append('nome', nome)
    formData.append('notes', notas)
    formData.append('idPaciente', id)

    const url = `http://127.0.0.1:5000/paciente/update`;
    const response = await fetch(url, {
        method: 'PUT',
        body: formData
    });

    if (response.ok) {
        $('#editPacienteModal').modal('hide');
        ListPaciente();
    } else {
        alert("Erro ao criar o paciente")
    }
}

async function listReceita(id) {
    try {
        $('#receitasModal').modal('show');
        document.getElementById('idPaciente').value = id
        const url = `http://127.0.0.1:5000/receita?idPaciente=${id}`;
        const response = await fetch(url, {
            method: 'get'
        });

        const data = await response.json();
        populateReceitaList(data.receitas);

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function populateReceitaList(receitas) {
    const tableElement = document.getElementById('TableReceita');
    if (tableElement && receitas.length != 0) {
        const div = document.getElementById('containerReceitas');
        div.style.display = 'block';

        if (tableElement.dataTable) {
            tableElement.dataTable.destroy();
        }

        const tableData = receitas.map(receita => [
            receita.remedio,
            formatarData(receita.data),
            formatarHora(receita.hora),
            `<button class="btn btn-danger" onclick="deleteReceita(${receita.id}, ${receita.idPaciente})">Deletar</button>`
        ]);


        const dataTable = new simpleDatatables.DataTable(tableElement, {
            data: {
                headings: ["Remédio", "Utilizar até o dia", "horas", "Controler"],
                data: tableData
            }
        });

        tableElement.dataTable = dataTable;
    } else {
        const div = document.getElementById('containerReceitas');
        div.style.display = 'none';
    }
}

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
    const [horaStr, minutoStr] = hora.split(':');
    const horaNum = String(horaStr).padStart(2, '0');
    const minutoNum = String(minutoStr).padStart(2, '0');
    return `${horaNum}:${minutoNum}`;
}

async function deleteReceita(idReceita, idPaciente){
    const formData = new FormData()
    formData.append('idReceita', idReceita)

    const url = `http://127.0.0.1:5000/receita/delete`;
    const response = await fetch(url, {
        method: 'delete',
        body: formData
    });

    if (response.ok) {
        listReceita(idPaciente)
    } else {
        alert("Erro ao deletar o paciente")
    }
}

async function createReceita() {
    const nome = document.getElementById('nomeReceita').value;
    const data = document.getElementById('dataReceita').value;
    const time = document.getElementById('timeReceita').value;
    const idPaciente = document.getElementById('idPaciente').value;
    
    const formData = new FormData();
    formData.append('data', data);
    formData.append('hora', time);
    formData.append('pacienteId', idPaciente);
    formData.append('remedio', nome);
    
    const url = `http://127.0.0.1:5000/receita/create`;
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    if (response.ok) {
        listReceita(idPaciente);
    } else {
        alert("Erro ao registrar nova receita");
    }
}