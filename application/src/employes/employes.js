import {useState,useRef,useEffect} from 'react';
import{Link}from 'react-router-dom'
import Axios from 'axios';

export default function Employes(){
//refs et states----
    //juste pour afficher des message d'error ou de confirmation 
    const [message,setMessage]=useState('')
   //state du data de tous les  employes
const [db,setDb]=useState([]);
const frm=useRef();

   //state remplie de l'employé recherché et un ref pour recuperer l'input de recherche et autre ref du forme de search pour le vider 
const [dbsearch,setDbsearch]=useState(null)
const inputsearch=useRef();
const frmsearch=useRef();


   //pour recuperer la valeur du btn si ajouter ou modifier
const btn_value=useRef();
   //recuperer les données  d'employe
const textid=useRef();
const textnom=useRef();
const textprenom=useRef();
const textposte=useRef();
const textcodeDep=useRef();
const textnomDep=useRef();

//import db from server to my var db=[] (!!!on peut pas ajouter asnc et await a useReff directement useEffect() a sa maniere de gerer l'async )
useEffect(
 ()=>{
       Axios.get('http://localhost:8000/employes').then(res=>setDb(res.data))
    },
    []
);
//functions------------------------------------------------------------------------------

//charger -------------
const Charger=async(identifiant)=>{

   await Axios.get('http://localhost:8000/employes/'+identifiant)
   .then(
        res=>{
            let emp=res.data;
        textid.current.value=emp.id;
        textnom.current.value=emp.nomEmp;
        textprenom.current.value=emp.prenomEmp;
        textposte.current.value=emp.poste;
        textcodeDep.current.value=emp.departement.codeDep;
        textnomDep.current.value=emp.departement.nomDep; 
        
        //bloquer le changement d'id && changer le labele du button
        textid.current.readOnly=true;
        btn_value.current.value='modifier'
    })
}
//Ajouter---------
const Ajouter=async()=>{
    let em={
        "id":textid.current.value,
        "nomEmp":textnom.current.value,
        "prenomEmp":textprenom.current.value,
        "poste":textposte.current.value,
        "departement":{
            "codeDep":textcodeDep.current.value,
            "nomDep":textnomDep.current.value
             }
        };

    if(btn_value.current.value==='ajouter')
    {
     const rep= await Axios.post(' http://localhost:8000/employes',em);//post is for submitting somthing to the servor
     setDb([...db,rep.data]);
     setMessage('employe bien ajouté')
    }
    
    else{
      const employe= await Axios.put('http://localhost:8000/employes/'+em.id,em);//put is similer to post but we uselly use it for modification
      console.log(employe.data);
      
      
      
      let pos=db.indexOf(e=>e.id=em.id);//geting l'index of the object to modify
     
      let t=[...db];
      t.splice(pos,1,em);
      setDb(t);
      //modifier le titre du btn et opening input d'id 
      btn_value.current.value="ajouter";
      textid.current.readOnly=false
    }
    frm.current.reset();//vider le formulaire apres avoir accomplir l'action voulue
}


//--supprimer------------------------
const supprimer=async(emp)=>{
    try{
   
        if(window.confirm("Etes-vous sûre de vouloir supprimer l'employe?")){
            await Axios.delete('http://localhost:8000/employes/'+emp).//emp c'est id emvoyer avec la fonction
            then(res=>{
                let t=db.filter(x=>x.id!==emp);//modification d'affichage
                setDb(t);
            })
        }
    }catch(err){
      console.log(err.message)
    }

    
}

//--rechercher-----------------------
const handlerSearch = (e) => {
    e.preventDefault();
    let searche = inputsearch.current.value; // pour recuperer se que l'user a ecrit dans la barre de recherche
    let t = [...db].filter(employe =>
      (employe.id.includes(searche)) ||
        (employe.nomEmp.includes(searche)) ||
        (employe.prenomEmp.includes(searche)) ||
        (employe.poste.includes(searche))
    );

    if (t.length > 0) {
        setDbsearch(t); //remplire mon state predefinie par les donner de t
    } else {
        setMessage('aucune correspondance'); //si non afficher un message 
    }
    frmsearch.current.reset();
};




//--fonction pour lister tous les employes ou l'employe recherché -------------

    
    const lister = () => {

        let liste = dbsearch ?? db;//(nullish coalescing operateur ??)veut dir affecter a liste le comptenu du  dbsearch(state de la bare de recherche ) mais si set state est null ou undefined affecter a liste le comptenu du db(state de tous les employes)
            return (
                liste.length>0 ?(
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>nom</th>
                            <th>prenom</th>
                            <th>post</th>
                            <th>departement</th>
                            <th>options</th>
                            <th>details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liste.map((e, i) => (
                            <tr key={i}>
                                <td>{e.id}</td>
                                <td>{e.nomEmp}</td>
                                <td>{e.prenomEmp}</td>
                                <td>{e.poste}</td>
                                <td>{e.departement.nomDep}</td>
                                <td>
                                    <button onClick={() => Charger(e.id)}>modifier</button>
                                    <button onClick={() => supprimer(e.id)}>supprimer</button>
                                </td>
                                <td>
                                   <Link to='/employes/${e.id}'>salaire</Link>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                ): <h3>pas d'employes!!!</h3>
            )
        
           
         
    };
    
//------------- 
 return(
     <>
     <hr/>
     <h1 style={{textAlign:'center'}}>gestion des emploiyes</h1>
     <form style={{margin:'auto',width:'50%'}} ref={frm}>
        <div>{message}</div>
        <input type="text" ref={textid} placeholder="id" /><br />
        <input type="text" ref={textnom} placeholder="nom" /><br />
        <input type="text" ref={textprenom} placeholder="prenom" /><br />
        <input type="text" ref={textposte} placeholder="post" /><br />
        <input type="text" ref={textcodeDep} placeholder='code departement'/>
        <input type="text" ref={textnomDep} placeholder="nom departement" /><br/>
        <input type="button" ref={btn_value} value='ajouter' onClick={()=>Ajouter()}></input>
     </form>
     <form ref={frmsearch}>
        <input type='searche' ref={inputsearch} /><button onClick={(e)=>{handlerSearch(e)}}>searche</button>
     </form>
     <div>
     <h3>liste des emploiyes</h3>

     {lister()}
     </div>
    
       
    

     </>
    )
}
