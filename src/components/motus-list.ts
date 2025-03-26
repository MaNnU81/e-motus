import  Motus  from "../model/motus";
import MotusService from "../services/motus-service";
import MotusCard from "./motus-card";
import SuperDialog from "./motus-dialog";


export default class MotusList extends HTMLElement {
    service:MotusService;
    moti: Motus[];

    constructor() {
        super()
        this.attachShadow({mode: 'open'});
        this.service = new MotusService();
        this.moti = [];
    }

    async connectedCallback(){
        this.moti = await this.service.loadMoti();
        this.styling()
        this.render()
    }


    styling(){
        const style = document.createElement('style');
        style.innerText = `
        .main-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            background-color: rgba(49, 201, 221, 0.67);
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
        }

        .grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%; /* La griglia occupa tutta la larghezza */
        }

        motus-card {
            width: 100%; /* Ogni card occupa tutta la larghezza */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 16px;
            background-color: white;
        }

        .add-btn, .ran-btn {
            position: fixed; /* Posizionamento assoluto */
            bottom: 20px; /* Distanza dal fondo */
            right: 20px; /* Distanza dal lato destro */
            margin-top: 16px;
            padding: 10px;
            display: flex;  
            justify-content: center;  
            align-items: center;  
            background-color: green;
            border: 2px solid yellow;
            color: white;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .ran-btn {
            right: 140px; /* Sposta il bottone random più a sinistra rispetto al bottone "Inserisci" */
        }

        .add-btn:hover, .ran-btn:hover {
            background-color: red;
            transform: scale(1.1);
        }
    `
        this.shadowRoot!.appendChild(style);
    }
    render() {
        let container = this.shadowRoot!.getElementById('container');
    
        if (container) {
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.id = "container"; // container.setAttribute('id', 'container'); 
            this.shadowRoot!.appendChild(container);
        }
    
        // Contenitore principale
        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('class', 'main-container');
    
        // Titolo in alto
        const title = document.createElement('h1');
        title.textContent = '@Motus'; // Testo del titolo
        mainContainer.appendChild(title);
    
        // Griglia dei Motus
        const main = document.createElement('div');
        main.classList.add('grid');
        
        for (let i = 0; i < this.moti.length; i++) {
            const motus = this.moti[i];
            const card: MotusCard = document.createElement('motus-card') as MotusCard;
            card.setAttribute("selected-motus", JSON.stringify(motus));
            main.appendChild(card);
        }
    
        mainContainer.appendChild(main);
        container.appendChild(mainContainer);
    
        // Pulsante per aggiungere un Motus casuale
        const addRandomBtn = document.createElement("button");
        addRandomBtn.classList.add("ran-btn");
        addRandomBtn.appendChild(document.createTextNode("✔️ Random"));
        addRandomBtn.addEventListener('click', () => this.addRandomMotus());
        mainContainer.appendChild(addRandomBtn);
    
        // Pulsante per aprire la finestra di dialogo
        const addCustomBtn = document.createElement("button");
        addCustomBtn.classList.add("add-btn");
        addCustomBtn.appendChild(document.createTextNode("➕ Inserisci"));
        addCustomBtn.addEventListener('click', () => this.openDialog());
        mainContainer.appendChild(addCustomBtn);
    }
    
    openDialog() {
        const dialog = document.createElement('super-dialog') as SuperDialog;
    
        dialog.addEventListener('student-added', (event: CustomEvent) => {
            const newMoti = event.detail;
            this.moti.push(newMoti);
            localStorage.setItem('moti', JSON.stringify(this.moti));
            this.render();
        });
    
        this.shadowRoot!.appendChild(dialog);
       
    }
    addRandomMotus() {
        // console.log('Aggiungi un Motus casuale!');
        
        const randomMotus = {
            value: Math.floor(Math.random() * 5), 
            note: this.generateRandomNote(),
            creationDate: Date.now()
        };
    
        this.moti.push(randomMotus); 
        localStorage.setItem('moti', JSON.stringify(this.moti));
        this.render(); 
    }

    generateRandomNote(): string {
        const words = ['gatto', 'sole', 'pizza', 'arcobaleno', 'cane', 'mare', 'montagna', 'fiore', 'libro', 'penna'];
        const randomLength = Math.floor(Math.random() * 5) + 3; // Lunghezza casuale tra 3 e 7 parole
        let note = '';
    
        for (let i = 0; i < randomLength; i++) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            note += randomWord + ' ';
        }
    
        return note.trim(); // Rimuove lo spazio finale
    }

}


customElements.define('motus-list', MotusList)