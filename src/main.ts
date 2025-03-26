import MotusService from "./services/motus-service";
import './style.css'
import SuperDialog from "./components/motus-dialog";

// const list = new MotusList();
const service = new MotusService();
const moti = await service.loadMoti();



console.log(moti);
