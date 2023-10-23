

Then('I sleep for sec {int}' , async function(waitFor){
    await new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(true)
        }, waitFor*1000 )
    })
})