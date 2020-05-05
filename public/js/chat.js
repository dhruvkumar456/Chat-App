const socket=io()

//ELEMENTS
const $messageForm=document.querySelector('form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location')
const $message=document.querySelector('#messages')
const $sidebar=document.querySelector('#sidebar')

//TEMPLATES
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    const $newMessage = $message.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visibleHeight = $message.offsetHeight
    const containerHeight = $message.scrollHeight
    const scrollOffset = $message.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}


socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('locationMessage',(location)=>{
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a'),
        username:location.username

    })
    $message.insertAdjacentElement('beforeend',html)
    autoscroll()
})

socket.on('roomdata',({room,users})=>{
    console.log(room)
    console.log(users)

    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    $sidebar.innerHTML=html


})


//TO SEND THE MESSAGE TO ALL USERS...
$messageForm.addEventListener('submit',(event)=>{
    event.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    socket.emit('sendMessage',$messageFormInput.value,room,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value='',$messageFormInput.focus()


        if(error){
           return console.log('Not delivered!')
        }
        console.log('Message get delivered!')
    })
})




//TO SHARE THE LOCATION OF THE USER..
document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser doesnot support geolocation')
    }

    $locationButton.setAttribute('disabled','disabled')


    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation',{longitude:position.coords.longitude,latitude:position.coords.latitude},()=>{
            $locationButton.removeAttribute('disabled')
            console.log('Location send!')
        })
    },(error)=>{
        $locationButton.removeAttribute('disabled')
        console.log(error)
    })

})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})