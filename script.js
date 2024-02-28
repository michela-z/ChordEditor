const testo = document.querySelector('#testo');
let testoFormattato = document.querySelector(".testo-formattato");
let pulsante = document.querySelector('.pulsante');

let containerTesto = document.querySelector('.container-testo');

pulsante.addEventListener('click', () => {
    location.reload()
    localStorage.removeItem('accordoSelezionato')
})

let testoAccordi = testo.value;

//INSERIRE Titolo

let inputTitolo = document.querySelector('#titolo')

let titolo = document.querySelector('.titolo')
titolo.innerText = inputTitolo.value;

//non funziona su firefox 
// ritornello.addEventListener('click', () => {
//     let text = window.getSelection().toString()
//     console.log(text);
// })

let cntAccordi = document.querySelector('.cnt-accordi');
let aggiungiAccordo = document.querySelector('.aggiungi');
let rimuoviAccordo = document.querySelector('.rimuovi');
let input = document.querySelector('.get-accordo');

let allAccordi = [];
let ritornelloBold = [];
let selRit = document.querySelector('#ritornello');

aggiungiAccordo.addEventListener('click', () => {

    if(input.value === '') {
        console.log('vuoto');
        return;
    }

    allAccordi.push(input.value)
    let newAccordo = document.createElement('button')
    newAccordo.classList.add('btn-accordo');
    cntAccordi.prepend(newAccordo)
    newAccordo.innerText = `${input.value.toUpperCase()}`

    let accordo = document.querySelectorAll('.btn-accordo');

    for (let i = 0; i < accordo.length; i++) {

        accordo[i].addEventListener('click', selezionaAccordo);

        function selezionaAccordo() {

            cntAccordi.childNodes.forEach(e => {
                if(e.classList.contains('selezionato')) {
                    e.classList.remove('selezionato')
                }
            })

            if(accordo[i].classList.contains('selezionato')) {
                //accordo[i].classList.remove('selezionato');
                localStorage.removeItem('accordoSelezionato');
                //console.log('if', accordo[i], i);
            } else {
                accordo[i].classList.add('selezionato');
                //console.log('else', accordo[i], i);
            }

            localStorage.setItem("accordoSelezionato", accordo[i].innerHTML);

        }
        return;
    }
})

rimuoviAccordo.addEventListener('click', () => {

    let accInseriti = cntAccordi.childNodes;

    for(let i = 0; i < accInseriti.length; i++ ) {
        console.log(accInseriti[i].innerText)
        let accSelezionato = localStorage.getItem("accordoSelezionato")
        if(accInseriti[i].innerText === accSelezionato) {
            accInseriti[i].remove()
        }
    }
})



// CREA UN PARAGRAFO DIVERSO PER OGNI RIGA
//ogni volta che incontri una '\n' crea un paragrafo nuovo

let indiceFineFrase = [0];

for(let i = 0; i < testoAccordi.length; i++ ) {
    if(testoAccordi[i] === "\n") {
        indiceFineFrase.push(i)
    }
}
console.log(indiceFineFrase)


let index = 0;

indiceFineFrase.forEach( e => {

    let frase = testoAccordi.slice(e, indiceFineFrase[index + 1])
    index = index + 1;

    //contenitore di frase e accordo
    let contenitoreAccFrase = document.createElement('div');
    contenitoreAccFrase.classList.add('cnt-acc-frase')
    containerTesto.append(contenitoreAccFrase);

    let accordiFormattati = document.createElement('div');
    let frasi = document.createElement('p');

    contenitoreAccFrase.append(frasi);
    frasi.classList.add('testo-formattato');
    frasi.innerHTML = frase;

    contenitoreAccFrase.prepend(accordiFormattati);
    accordiFormattati.classList.add('accordi-formattati');

    // if(frasi.innerHTML === ' ') {
    //     console.log('ce sta')
    // }

    // // EVIDENZIARE IL RITORNELLO
    // selRit.addEventListener('click', evidenziaRIT)

    // function evidenziaRIT() {
    //     var start = testo.selectionStart;
    //     var finish = testo.selectionEnd;
    //     var sel = testo.value.substring(start, finish);

    //     ritornelloBold = `<b> ${sel} </b>`;
    //     console.log(ritornelloBold);
    // };


    //incolla accordo al click su contenitore degli accordi

    function inserisciAccordo(event) {

        //let container = document.querySelector('.container');

        let xaxis = event.clientX - (window.innerWidth / 1.95);

        let nota = document.createElement('div');
        contenitoreAccFrase.append(nota);
        nota.classList.add('nota')
        //nota.setAttribute('id', 'nota');

        nota.innerHTML = `${localStorage.getItem("accordoSelezionato")}`;
        nota.style.transform = `translateY(${accordiFormattati.offsetTop}px) translateX(${xaxis}px)`
    }

    accordiFormattati.addEventListener("click", inserisciAccordo);
})


// DOWNLOAD IMAGE
document.getElementById('download-pdf')
        .addEventListener('click', () => {

            const element = document.getElementById('content');

            const options = {
                filename: 'GFG.pdf',
                margin: 0,
                image: { type: 'png', quality: 100 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait'
                },
                pagebreak: { mode: 'avoid-all'}
            };

            html2pdf().set(options).from(element).save();
        });


//RIMUOVERE un'accordo dal testo quando si clicca sopra con il tasto destro del mouse
function rimuoviElemento(event) {
    event.preventDefault();
    console.log(event.target)
    this.remove();
}

// let contenitoreAcc = document.querySelectorAll('.accordi-formattati');
// contenitoreAcc.forEach( e => {
//     e.addEventListener('dblclick', rimuoviElemento);
// });

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if(event.target.classList == "nota") {
        event.target.remove();
    }
});



function bold(event) {
    event.preventDefault();
    if(event.target.classList != "testo-formattato bold") {
        console.log('non è bold')
        event.target.classList.add('bold')
    } else {
        console.log('è bold, rimuovo la classe')
        event.target.classList.remove('bold')
    }
}

let ritornello = document.querySelectorAll('.testo-formattato');
    ritornello.forEach( e => {
        e.addEventListener('contextmenu', bold);
});

