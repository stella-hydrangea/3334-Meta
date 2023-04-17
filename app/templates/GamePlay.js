const mainCanvas= document.querySelector("canvas")
const c =mainCanvas.getContext('2d')
const text=document.querySelector('gameScreen')
const userTable=document.querySelector('#nameTable')
const contextMenu=document.querySelector('#context-menu')
const targetName=document.querySelector('#targetName')
const playerInfo=document.querySelector('#playerInfo')
const requestArea=document.querySelector('#requestArea')
const inventory=document.querySelector('#inventory')
const appendInventBtn=document.querySelectorAll('.invent-btn')
const tradeappendInventBtn=document.querySelectorAll('.tradeInvent-btn')
const inventGroup=document.querySelector('#inventGroup')
const chatandtrade=document.querySelector('#chatandtrade')
const leaveChatandTrade=document.querySelector('#leaveChatandTrade')
const treasureName="treasure"
const treasureSize=20
const treasureInventSize=40
const treasureInventX=350
const treasureInventY=771
const treasureInventOffset=116
var counter=0;
var time=0;
var setTimer=false
const Username="Alice"
var otherPlayers=[]
var treasures =[]
var ownedTreasures=[]
var left,right,up,down,tab=false

//console.log(inventGroup)
class Sprite {
    constructor(name,positionX=0,positionY=0,color='black',radius=50,speed=1.5){
        this.name=name
        this.color=color
        this.radius=radius
        this.speed=speed
        this.positionX=positionX
        this.positionY=positionY
    }
    draw(){
        c.beginPath();
        c.arc(this.positionX,this.positionY, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = this.color
        c.fill();
        c.lineWidth = 1;
        c.strokeStyle = '#003300';
        c.stroke();
    }
}

const mainCharacter=new Sprite(Username)
mainCanvas.width=1536
mainCanvas.height=864
c.fillStyle='white'
c.fillRect(0,0,mainCanvas.width,mainCanvas.height)

function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function createHTML(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}



userTable.addEventListener('contextmenu',(e)=>{
    e.preventDefault();
    //console.log(e.target.innerHTML)
    if(e.target.innerHTML!="Player" && e.target.innerHTML!=Username){
        const {clientX:mouseX,clientY:mouseY}=e
        contextMenu.style.top=`${mouseY}px`;
        contextMenu.style.left=`${mouseX}px`;
        targetName.innerHTML=e.target.innerHTML;
        //console.log(targetName.innerHTML)
        contextMenu.classList.add("active");
    } 
})
document.addEventListener('click',(e)=>{
    if(e.target.offsetParent!=contextMenu){
        contextMenu.classList.remove('active');
    }
})

leaveChatandTrade.addEventListener('click',(e)=>{
    chatandtrade.classList.remove('active')
    inventory.classList.remove('active')
    drop_all(tradeappendInventBtn);
    drop_all(appendInventBtn);
    drawInvent(ownedTreasures);

})

contextMenu.addEventListener('click',(e)=>{
    //console.log(e.target.innerHTML)
    //console.log(e.target.parentElement.children[2].innerHTML)
    contextMenu.classList.remove('active');
    playerInfo.classList.remove('active');
    setRequest(Username,'chat')
})
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var originX,originY=0

mainCanvas.addEventListener('keydown',(e)=>{
    //console.log(e.key)
    switch(e.key){
        case 'w':
            up=true
            break;
        case 'a':
            left=true
            break;
        case 's':
            down=true
            break;
        case 'd':
            right=true
            break;
        case 'Tab':
            e.preventDefault();
            tab=true;
            playerInfo.classList.add('active');
            inventory.classList.add('active')
            break;
    }

})

mainCanvas.addEventListener('keyup',(e)=>{
    switch(e.key){
        case 'w':
            up=false
            break;
        case 'a':
            left=false
            break;
        case 's':
            down=false
            break;
        case 'd':
            right=false
            break;
        case 'Tab':
            tab=false
            playerInfo.classList.remove('active');
            contextMenu.classList.remove('active');
            inventory.classList.remove('active')
            break;
    }
})

function isCollapsed(mainCharacter,treasures){
    var c=-1
    if(treasures.length!=0){
        var i=0;
        treasures.forEach(element => {
        distance=Math.round(Math.sqrt((element.positionX-mainCharacter.positionX)**2+(element.positionY-mainCharacter.positionY)**2))
        if(distance<=(element.radius+mainCharacter.radius)){
            //console.log(treasures.splice(i,1)[0])
            c=i;
        }else{
            element.draw()
        }
        i++;
    });
    }
    if(c!=-1){
        return treasures.splice(c,1)[0]
    }else return false
}

function wallCollision()
{
    if(mainCharacter.positionX>=1480) right=false
    if(mainCharacter.positionX<=53) left=false
    if(mainCharacter.positionY>=810) down=false
    if(mainCharacter.positionY<=53) up=false
}
function move(){
    if(up==true)mainCharacter.positionY-=5*mainCharacter.speed
    if(down==true)mainCharacter.positionY+=5*mainCharacter.speed
    if(left==true)mainCharacter.positionX-=5*mainCharacter.speed
    if(right==true)mainCharacter.positionX+=5*mainCharacter.speed
}

function randomTrasure(){
    const wmax=1500
    const wmin =70
    const hmax=800
    const hmin =70
    startX=Math.random() * (wmax - wmin) + wmin;
    startY=Math.random() * (hmax - hmin) + hmin;
    var treasure3=new Sprite(treasureName,startX,startY,'yellow',treasureSize)
    treasures.push(treasure3)
}

function newPlayer(name){
    var otherPlayer = new Sprite(name,500,500,'red')
    otherPlayers.push(otherPlayer)
}
newPlayer('Bob');

function drawOtherPlayer(){
    otherPlayers.forEach((element)=>{
        element.positionX
        element.draw()
    })
}

function setProgress(){
    //console.log(document.querySelector('.progress-bar'))
        //console.log('running')
    progress=document.querySelector('.progress-bar');
    var x=parseInt(progress.style.width.replace('%',''))+1
    progress.style.width=`${x}%`
    if(x>=102){
        requestArea.innerHTML='';
        setTimer=false;
    }
}


function setRequest(Username,action){
    Username=escapeHtml(Username)
    action=escapeHtml(action)
    htmlStr=`<div id="request" data-from="${Username}">
                <div class="container">
                    <div class="row">
                        <div class="col-12" id="requestContent">${Username} has send a ${action} request to you</div>
                    </div>
                    <div class="row">
                        <div class="col-12 progress" >
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6" id="accept-btn">Accept</div>
                        <div class="col-6" id="decline-btn">Decline</div>
                    </div>
                </div>
            </div>`
    requestArea.innerHTML=htmlStr;
    var request=document.querySelector('#request');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    request.addEventListener('click',(e)=>{
        //console.log(e.target.innerHTML)
        //console.log(e.currentTarget.getAttribute('data-from'))
        if(e.target.innerHTML=='Accept'){
            //console.log(1)
            requestArea.innerHTML='';
            setTimer=false
            time=0
            chatandtrade.classList.add('active') 
            inventory.classList.add('active')
        }else if(e.target.innerHTML=='Decline'){
            //console.log(0)
            requestArea.innerHTML='';
            setTimer=false
            time=0
        }
    })
    setTimer=true
}

function getTreasure(treasure){
    //console.log(treasure)
    if(treasure!=false&&ownedTreasures.length<7){
        ownedTreasures.push(treasure)
        //console.log(ownedTreasures)
        drawInvent(ownedTreasures);
    }
}

function drawInvent(ownedTreasures){
    var i=0;
    //console.log(ownedTreasures)
    if(ownedTreasures.length!=0){
        ownedTreasures.forEach((element)=>{
            var color=escapeHtml(element.color)
            var htmlStr=`<button class="inventBtn" id="inventBtn${i}" draggable="true" ondragstart="drag(event)" style="background-color: ${color};"></button>`
            //console.log(appendInventBtn)
            appendInventBtn[i].innerHTML=htmlStr
            i++;
        })
    }
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev)
    //console.log(ev.dataTransfer.getData("text"))
  }
  
function drop(ev) {
    console.log(ev)
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log(data)
    ev.target.appendChild(document.getElementById(data));
}

console.log(tradeappendInventBtn)
function drop_all(clear_invent) {
    var i=0
    tradeappendInventBtn.forEach((e)=>{
        tradeappendInventBtn[i].innerHTML=""
        i++;
    })
    
    //console.log(data)
}


function mainLoop(){
    if(counter==100){
        randomTrasure();
        counter=0;
    }
    if(setTimer){
        time++;
        //console.log(time)
        if(time==10){
            setProgress()
            time=0
        }
    }
    //console.log(mainCharacter.positionX)
    //console.log(mainCharacter.positionY)
    if(counter==100){
        randomTrasure();
        counter=0;
    }
    c.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight)
    c.fillStyle='white'
    c.fillRect(0,0,mainCanvas.width,mainCanvas.height)
    wallCollision()
    move()
    getTreasure(isCollapsed(mainCharacter,treasures));
    //console.log(getItem)
    mainCharacter.draw() 
    drawOtherPlayer()
    counter++;
    //console.log(tab)
    //console.log(counter)
    requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop);
