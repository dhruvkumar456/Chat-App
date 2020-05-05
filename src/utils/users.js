const users=[]

const addUser=({id,username,room})=>{
    //trim the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error:'Username and room is required!'
        }
    }

    //Check for exististing User
    const existingUser=users.find((user)=>{
        return user.username === username && user.room === room
    })

    /*(By using c++ method)
    let existingUser=0
    for(let i=0;i<users.length;i++)
    {
        if((users[i].username === username) && (users[i].room === room))
        existingUser=1;
    }*/


    //Validate User
    if(existingUser){
        return {
            error:'Username is already use!'
        }
    }


    //Storing Data
    const user={id,username,room}
    users.push(user)
    return user
}



const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const user=users.find((user)=>{
        return user.id === id
    })

    return user
}


const getUsersInRoom=(room)=>{
    const allUser=users.filter((user)=>{
        return user.room === room
    })

    return allUser
}

module.exports={
    addUser,
    removeUser,
    getUser, 
    getUsersInRoom
}