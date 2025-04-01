import React from 'react';
import {useRef,useState} from 'react';
function Materiel(){

//ref et states--------
    const codemat=useRef();
    const marque=useRef();
    const dtd=useRef();
    const categorie=useRef();
    const [recap,setRecap]=useState({});
  
//functions-------
  const  handlerConfirme=(event)=>{
    event.preventDefault()
        let infos={
            'code materiel':codemat.current.value,
            'marque pc':marque.current.value,
            'date debut d\'utilisation':dtd.current.value,
            'categorie':categorie.current.value,
        };
        setRecap(infos)
    }
    //----------------
    
    return(
        <>
        <h1 style={{textAlign: 'center'}}>gestion materiel</h1><hr />
        
        <form style={{margin:'auto',width:'50%'}}>
            
            <input type="text" ref={codemat} placeholder="code materiel" /><br />
            <label htmlFor="marque">marque:</label>
            <select id="marque" ref={marque}>
                <option value="dell">dell</option>
                <option value="hp">hp</option>
                <option value="lenovo">lenovo</option>
            </select><br />
            <label htmlFor="dt">debut d'utilisation:</label>
            <input type="date" ref={dtd} id="dt" /><br />
            <input type="text" ref={categorie} placeholder="categorie" /><br />
            <button onClick={(event)=>handlerConfirme(event)}>confirmer</button>
        </form>
        
        <div>
            <h3>recapulatif des information:</h3>
            <ul style={{listStyle:'none'}}>
                {
                    Object.keys(recap).map(k=>[k,recap[k]]).map((element,i)=>{
                        return <li key={i}>{element[0]}:  {element[1]}</li>
                    })
                    
                }
            </ul>
        </div>
        </>

    )
}
export default Materiel
//The Object.keys() static method returns an array of a given object's own enumerable string-keyed property names.
