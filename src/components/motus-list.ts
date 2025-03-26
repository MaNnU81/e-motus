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
            .grid{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px)); 
                gap: 16px;
            }
            .add-btn {
    position: absolute;
    bottom: 120px;
    right: 20px;
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

.add-btn:hover {
    background-color: red;
    transform: scale(1.1);
}
          .ran-btn {
    position: absolute;
    padding: 10px;
    bottom: 10px;
    right: 20px;
    display: flex;  
    justify-content: center;  
    align-items: center;  
    background-color: red;
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

.ran-btn:hover {
    background-color: darkgreen;
    transform: scale(1.1);
}

        `
        this.shadowRoot!.appendChild(style);
    }

    render(){

        let container = this.shadowRoot!.getElementById('container');

        if (container) {
            container.innerHTML = '';
        }else{
            container = document.createElement('div');
            container.id = "container"    // container.setAttribute('id', 'container'); 
            this.shadowRoot!.appendChild(container);
        }


        const main = document.createElement('div');
        main.classList.add('grid')
    
        for (let i = 0; i  < this.moti.length; i++) {
            const motus  = this.moti[i];
            const card:  MotusCard = document.createElement('motus-card') as MotusCard;
            card.setAttribute("selected-motus", JSON.stringify(motus));

            

            main.appendChild(card)
        }

        container.appendChild(main)

        // Pulsante per aggiungere un Motus casuale
    const addRandomBtn = document.createElement("button");
    addRandomBtn.classList.add("ran-btn");
    addRandomBtn.appendChild(document.createTextNode("✔️ Random"));
    addRandomBtn.addEventListener('click', () => this.addRandomMotus());
    container.appendChild(addRandomBtn);

    // Pulsante per aprire la finestra di dialogo
    const addCustomBtn = document.createElement("button");
    addCustomBtn.classList.add("add-btn");
    addCustomBtn.appendChild(document.createTextNode("➕ Inserisci"));
    addCustomBtn.addEventListener('click', () => this.openDialog());
    container.appendChild(addCustomBtn);
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
        dialog.addMoti({ value: 0, note: '' }, this.moti.length); // Passa un oggetto vuoto per inizializzare il dialogo
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