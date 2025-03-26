import MotusService from "./services/motus-service";
import MotusList from "./components/motus-list";



import './style.css'
const list = new MotusList();
const service = new MotusService();
const moti = await service.loadMoti();


console.log(moti);
