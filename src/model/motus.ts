import Location  from "./location"


export default interface Motus {
    id: string
    value: number
    note: string
    creationDate: number
    location?: Location     //metto il ? per non avere obbligatorieta nella creazione dei nuovi motus
  }
  
 