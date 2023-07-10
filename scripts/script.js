
//Criando as constantes que armazenarão os ids dos inputs para cada campo do forms
const nome = document.getElementById('nome')
const sobrenome = document.getElementById('sobrenome')
const senha = document.getElementById('senha')
const confirmacao_senha = document.getElementById('confirmacao_senha')
const email = document.getElementById('email')
const confirmacao_email = document.getElementById('confirmacao_email')
const cidade = document.getElementById('cidade')
const cpf= document.getElementById('CPF')
const cep = document.getElementById('CEP')
const estado = document.getElementById('estado')


//constante que armazena o id do forms
const form = document.getElementById('form')

//constante que armazena o id do elemento msg_erro do forms, ele irá mudar conforme o javascript detecta erro nas respostas do forms
const erro_ = document.getElementById('msg_erro')


//função para testar a validade do CPF, retirada do site da receita federal
function TestaCPF(strCPF) {
    var Soma; //Variavel responsável por somar os dígitos do CPF
    var Resto; // Variavel responsável por guardar o valor do resta das divisões
    Soma = 0; // inicialização da variavel soma 
  if (strCPF == "00000000000") return false; // retorna falsoautomaticamente caso o CPF seja tudo 0

  for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i); // Soma o resultado da multiplicação de cada digito do CPF com o valor 11(esse valor decai 1 a cada multiplicação,seu mínimo sendo 2)
  Resto = (Soma * 10) % 11; //faz o resto da soma acima

    if ((Resto == 10) || (Resto == 11))  Resto = 0; // Caso o resultado for maior que 9 (pois oprimeiro digito verificador deve ser de 0 à 9) é atribuido o valor 0 para a variavel resto
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;// compara o resto com o 9 dígito do CPF, caso eles sejam diferentes,a função retorna false,caso contrário, o codigo continua( a função substring precisa de dois parametros, um define onde começara a substring e outro onde acabará,.Neste exemplo,a asubstring pegara o somente o 9)

    //repete a msm coisa para o segundo dígito verificador do CPF
  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;

    //caso os dois digitos verificadores forem corretos, a função retorna true
    return true;
}



//os event listeners abaixo irão impedir o usuario de inserir valores incorretos nos campos
nome.addEventListener("input", (e) => {
    const value = e.target.value;
  
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      e.target.value = value.replace(/[^a-zA-Z\s]/g, '');
    }
  });
  
  sobrenome.addEventListener("input", (e) => {
    const value = e.target.value;
  
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      e.target.value = value.replace(/[^a-zA-Z\s]/g, '');
    }
  });
  
  cpf.addEventListener("input", (e) => {
    const value = e.target.value;
  
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
    }
  });
  
  cep.addEventListener("input", (e) => {
    const value = e.target.value;
  
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
    }
  });
  
  cidade.addEventListener("input", (e) => {
    const value = e.target.value;
  
    if (!/^[a-zA-Z]*$/.test(value)) {
      e.target.value = value.replace(/[^a-zA-Z]/g, '');
    }
  });
  



//Abaixo se encontra o código para preencher automaticamente os campos de estados e cidade quando o CEP for preenchido

//primeiramente, iremos verificar se o CEP inteiro foi inserido
cep.addEventListener("keyup", (e) => {
    const valorCep = e.target.value;
  
    if (valorCep.length === 8) {
      getAddress(valorCep);
    }
  });

// Função getAddress  para pegar os valores da API,precisa ser assincrona pois ela espera por uma resposta e pode travar todo o programa se for sincrona
const getAddress = async (cep) => {
  toggleLoader();     

 //coloca a URL da API em uma constante
 const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

 //o codigo espera(await) pela resposta da API e coloca a resposta em uma constante
 const response = await fetch(apiUrl);

 //coloca o valor de response como um JSON na variavel "data"
 const data = await response.json();
 
 //Caso o cep inserido for inválido, chamamos  a função da msg, dando o valor referente ao erro
 if (data.erro == true) {
   toggleLoader();
   
   erro_.innerText = "*CEP inválido";

   cep.reset();
   estado.reset();
   cidade.reset();

   return;
 }
 
 if(data.erro != true){
   erro_.innerText = "";
 }

   cidade.value = data.localidade;
   estado.value = data.uf;
   toggleLoader();
}

  
//Função do loader, ele irá aparecer quando o cep for digitado ou quando o forms for enviado
//ele é ativado quando a função é chamada e desativado quando ela é chamada dnovo
const toggleLoader = () => {
  cep.blur();
  const fadeElement = document.querySelector("#fade");
  const loaderElement = document.querySelector("#loader_img");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

  


  










//event listener que irá ser acionado quando o formulário foi enviado (por isso o parametro 'submit') e guarda esse evento no parametro "e" (sera utilizado para cancelar o envio caso hajam erros)
form.addEventListener('submit', (e) => {

    let erros = [] // cria una array chamada erros, ele guardará todas as msg de erros 


    //abaixo estão os ifs reponsáveis pela validação, cada um deles salva uma msg de erro na array erros caso detecte uma invalidade
    
    if(erro_.innerText.includes("*CEP inválido")){
      erros.push("*CEP inválido");
    
    }


    // if (/\d/.test(nome.value) || /[!@#$%^&*]/.test(nome.value)) {
    //     erros.push('*nome inválido')
    // }

    // if (/\d/.test(sobrenome.value) || /[!@#$%^&*]/.test(sobrenome.value)) {
    //     erros.push('*sobrenome inválido')
    // }

    if(!TestaCPF(cpf.value)){
        erros.push('*CPF inválido')
    }

    // if (/\d/.test(cidade.value) || /[!@#$%^&*]/.test(cidade.value)) {
    //     erros.push('*cidade inválida')
    // }
    

    if(email.value != confirmacao_email.value){
        erros.push('*o email deve ser o mesmo para os dois campos')
    }

    if(!(/\d/.test(senha.value) && /[A-Z]/.test(senha.value) && /[a-z]/.test(senha.value) && /[!@#$%^&*]/.test(senha.value)) || (senha.value.length < 8)) {
        erros.push('*senha inválida')
    }

    if(senha.value != confirmacao_senha.value){
        erros.push('*a senha deve ser a mesma para os dois campos')
    }

    
    //caso a array "erros" tenho um tamanho maior que 0, significa que houve erros, logo as msgs de erro seram escritas na tag de id "erro" do HTML. Alem disso o envio do formulario sera cancelado (e.preventDefault).
    if (erros.length > 0){
    e.preventDefault()
    erro_.innerText = erros.join(', ')
    }

})


