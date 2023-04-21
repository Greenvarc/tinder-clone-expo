const getMatchuserInfo=(users,userLoggedInId)=>{
    const newusers={...users};
    delete newusers[userLoggedInId];

    const [id,user]=Object.entries(newusers).flat()
    return {id,...user}

}

export default getMatchuserInfo;