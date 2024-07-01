
(function ($) {
    "use strict";
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);


const login = async () => {
    try {
        const email = document.getElementById('emailUser').value;
        const senha = document.getElementById('keyUser').value;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('senha', senha);
        const url = 'http://127.0.0.1:5000/usuairo/login';
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const usuario = await response.json()
            sessionStorage.setItem('userEmail', usuario.usuario.email)
            sessionStorage.setItem('userNome', usuario.usuario.nome)
            sessionStorage.setItem('userId', usuario.usuario.id)
            window.location.href = 'dashboard.html';
        } else {
            alert("Erro ao fazer o login, senha ou email errados");
        }

    } catch (error) {
        console.error('Erro ao fazer fetch:', error);
    }
    
}

const register = async () => {
    try {
        const email = document.getElementById('registerEmail').value;
        const senha = document.getElementById('registerKey').value;
        const name = document.getElementById('registerName').value;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('nome', name);
        const url = 'http://127.0.0.1:5000/usuairo/create';
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const usuario = await response.json()
            sessionStorage.setItem('userEmail', usuario.usuario.email)
            sessionStorage.setItem('userNome', usuario.usuario.nome)
            sessionStorage.setItem('userId', usuario.usuario.id)
            window.location.href = 'dashboard.html';
        } else {
            alert("Erro ao se registrar");
        }

    } catch (error) {
        console.error('Erro ao fazer fetch:', error);
    }
    
}
