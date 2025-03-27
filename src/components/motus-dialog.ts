
interface Moti {
    value: number
    note: string
}

export default class SuperDialog extends HTMLElement{
    dialog!: HTMLDialogElement;
    isEdit: boolean = false;
    private index: number = 0;

    constructor(){
        super();
       this.attachShadow({mode: 'open'})
    }

    connectedCallback(){
        this.styling();
        this.render()
    }

    styling(){
        const style = document.createElement('style');
        style.innerText = `
            // .card{
            //     border-radius: 8px;
            //     border: solid 1px #313131;
            //     padding: 8px;
            //     display: flex;
            //     flex-direction: column;
            //     align-items: center;
            // }
            .btn{
                background-color: white;
                border: none;
                font-size: 20px;
                padding: 0px 8px;
            }
        `
        this.shadowRoot!.appendChild(style);
    }

    render(){
        
        this.dialog = document.createElement('dialog');
        this.dialog.setAttribute('id', 'dialog');

        
        this.dialog.innerHTML = `
       <form id="motus-form" > 
                <label for="crying">😭</label>
                <input type="radio" name="motus" id="crying" value"0">  
                <label for="sad">😥</label>
                <input type="radio" name="motus" id="sad" value"1">
                <label for="neutral">😐</label>
                <input type="radio" name="motus" id="neutral" value"2">
                <label for="happy">🙂</label>
                <input type="radio" name="motus" id="happy" value"3">
                <label for="euphoric">😁</label>
                <input type="radio" name="motus" id="euphoric" value"4">
                <label for="note">Come ti senti?</label>
                <textarea name="note" id="note"></textarea>
            </form>
        `
        const cancelBtn = document.createElement('button');
        cancelBtn.appendChild(document.createTextNode('cancella'));
        cancelBtn.addEventListener('click', () => this.dialog.close());
        this.dialog.appendChild(cancelBtn)

        const okBtn = document.createElement('button');
        okBtn.appendChild(document.createTextNode('ok'));
        okBtn.addEventListener('click', () => this.dispatchMoti());
        this.dialog.appendChild(okBtn)

        this.shadowRoot!.appendChild(this.dialog);
    }

    dispatchMoti(){
        const form = this.shadowRoot!.getElementById('motus-form') as HTMLFormElement | null;
      
        const data = new FormData(form);
        const moti = {
            emoticon: data.get('emoticon'),
            note: data.get('note')
        }

        if (this.isEdit) {
            const event = new CustomEvent('student-edited', {detail: {index: this.index, moti: moti}})
            this.dispatchEvent(event);
        } else {
            const event = new CustomEvent('student-added', {detail: moti})
            this.dispatchEvent(event);
        }

        
    }

    setupForm(moti: { value: any; note: any; } | undefined) {
        const form = this.shadowRoot!.getElementById('form') as HTMLFormElement | null;
    
        if (!form) {
            console.error('Il modulo non è stato trovato.');
            return;
        }
    
        form.reset(); 
    
        if (moti) {
            
            const emoticonInput = this.shadowRoot!.getElementById('emoticon') as HTMLInputElement | null;
            const noteInput = this.shadowRoot!.getElementById('note') as HTMLInputElement | null;
    
            if (emoticonInput) {
                emoticonInput.value = moti.value.toString();
            }
            if (noteInput) {
                noteInput.value = moti.note;
            }
        }
    }

    editMoti(moti: { value: any; note: any; } | undefined) {
        this.isEdit = true;
        
        this.setupForm(moti)
        this.dialog.showModal()
    }

    addMoti(moti: Moti, index: string) {
        console.log('Dati ricevuti in addMoti:', moti); // Logga il contenuto di moti
        console.log('Indice ricevuto:', index); // Logga l'indice ricevuto
    
        this.isEdit = false;
        this.setupForm(moti);
        this.dialog.showModal();
    }


}

customElements.define('super-dialog', SuperDialog)