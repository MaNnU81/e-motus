import  Motus  from "../model/motus";
import MotusService from "../services/motus-service";


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
                grid-template-columns: 1fr 1fr;
                gap: 16px;
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
            const card = document.createElement('h3');
            card.innerText = motus.note;

            main.appendChild(card)
        }

        container.appendChild(main)

        
    }

    

}


customElements.define('motus-list', MotusList)