const testo = document.querySelector('#testo');
let testoFormattato = document.querySelector(".testo-formattato");
let pulsante = document.querySelector('.pulsante');

let containerTesto = document.querySelector('.container-testo');
let pagina1 = document.querySelector('.pagina-1');
let pagina2 = document.querySelector('.pagina-2');
let pagina3 = document.querySelector('.pagina-3');

pulsante.addEventListener('click', () => {
    location.reload()
    localStorage.removeItem('accordoSelezionato')
})

let testoAccordi = testo.value;


//INSERIRE Titolo

let inputTitolo = document.querySelector('#titolo');
let inputAutore = document.querySelector('#autore');

let titolo = document.querySelector('.titolo');
titolo.innerText = inputTitolo.value;

let autore = document.querySelector('.autore');
autore.innerText = inputAutore.value;

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


    //EVITARE IL MAIUSCOLO IN LETTERE CHE DEVONO RIMANERE SCRITTE IN MINUSCOLO
    if(input.value.includes('b')) {
        //console.log('if')
        //console.log(input.value.indexOf('b'))
        let noBemolle = input.value.replace('b', '');
        newAccordo.innerText = `${noBemolle.toUpperCase() + 'b'}`

    } else if (input.value.includes('m')) {

        let emme = input.value;
        let index = [];

        for(let i = 0; i < emme.length ; i++) {
            if (emme[i] === "m") index.push(i);
        }

        //console.log('else if', index);

        let minore = index[index.length - 1];
        newAccordo.innerText = `${emme.slice(0, minore).toUpperCase()}` + `${emme.slice(minore, emme.length)}`;

        //// questo return non permette che si selezioni il MI
        if(index.includes(0) && index.length === 1) {
            newAccordo.innerText = `${input.value.toUpperCase()}`
            //return;
        }

    } else {
        //console.log('else')
        newAccordo.innerText = `${input.value.toUpperCase()}`
    }


    let accordo = document.querySelectorAll('.btn-accordo');

    for (let i = 0; i < accordo.length; i++) {

        console.log(cntAccordi.childNodes);

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
        //console.log(accInseriti[i].innerText)
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

    if (pagina1.childNodes.length < 17) {
        pagina1.append(contenitoreAccFrase);
    } else if (pagina2.childNodes.length < 20) {
        pagina2.append(contenitoreAccFrase);
    } else {
        pagina3.append(contenitoreAccFrase);
    }

    // per una corretta impaginazione nel pdf: creare un container nuovo ogni 17 elementi (.cnt-acc-frase) inseriti.
    let accordiFormattati = document.createElement('div');
    let frasi = document.createElement('p');

    contenitoreAccFrase.append(frasi);
    frasi.classList.add('testo-formattato');
    frasi.innerHTML = frase;

    contenitoreAccFrase.prepend(accordiFormattati);
    accordiFormattati.classList.add('accordi-formattati');


    //incolla accordo al click su contenitore degli accordi

    function inserisciAccordo(event) {

        //let container = document.querySelector('.container');

        let xaxis = event.clientX - (window.innerWidth / 1.90);
        //console.log(containerTesto.clientWidth, event.clientX, window.innerWidth / 1.85);
        //console.log(xaxis)

        let nota = document.createElement('div');
        accordiFormattati.append(nota);
        nota.classList.add('nota')
        //nota.setAttribute('id', 'nota');

        nota.innerHTML = `${localStorage.getItem("accordoSelezionato")}`;
        nota.style.transform = `translateX(${xaxis}px)`
    }

    accordiFormattati.addEventListener("click", inserisciAccordo);
})


// DOWNLOAD IMAGE
document.getElementById('download-pdf')
        .addEventListener('click', () => {

            const element = document.getElementById('content');

            if (window.scrollY) {
                window.scroll(0, 0); // reset the scroll position to the top left of the document.
            }

            const options = {
                filename: `${inputTitolo.value}_chord.pdf`,
                margin: [0.3, 0.5, 0, 0],
                image: { type: 'jpeg', quality: 100 },
                html2canvas: { scale: 2},
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait',
                },
                pagebreak: { mode: "css", after: ".pagina"}
            };

            html2pdf().set(options).from(element).save();

            // html2pdf().from(element).set({
            // margin:       [1, 0, 0, 0], 
            // filename: 'samplepdf.pdf',
            // pageBreak: { mode: 'css', before:'#nextpage1'},
            // jsPDF: {orientation: 'landscape', unit: 'in', format: 'letter'}
            // }).toPdf().get('pdf').then((pdf) => {
            // var totalPages = pdf.internal.getNumberOfPages();
            // for (i = 1; i <= totalPages; i++) {
            //     pdf.setPage(i);
            //     pdf.setFontSize(10);
            //     pdf.setTextColor(150);
            //     pdf.text('This is the header text', (pdf.internal.pageSize.getWidth()/2.40), (pdf.internal.pageSize.getHeight()-8));      
            //     pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth()/2.25), (pdf.internal.pageSize.getHeight() - 1);
            // }}).save();
            
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
        event.target.classList.add('bold')
    } else {
        event.target.classList.remove('bold')
    }
}

let ritornello = document.querySelectorAll('.testo-formattato');
    ritornello.forEach( e => {
        e.addEventListener('contextmenu', bold);
});

