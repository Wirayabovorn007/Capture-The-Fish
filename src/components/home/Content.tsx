import Statistic from "./Statistic"
import First_arc from "./First_arc"
import Second_arc from "./Second_arc"
import Whatis from "./Whatis_CTF"
import LearningJourney from "./Roadmap"
import CybersecurityCTA from "./Last"
import Reveal from "../effects/Reveal"

export default function Content(){
	return (
		<>
		<Reveal><First_arc/></Reveal>
		<Reveal><Statistic/></Reveal>
		<Reveal><Second_arc/></Reveal>
		<Reveal><Whatis/></Reveal>
		<Reveal><LearningJourney/></Reveal>
		<Reveal><CybersecurityCTA/></Reveal>
		</>
	)
}