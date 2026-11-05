import {Inngest} from "inngest"


export const client = new Inngest({
    id:"my-application"
});


const publisherFn = client.createFunction({
    id:"publish-emails",
    name:"event/publish.emails"
},async({step,event})=>{
    try {
        const {topic} = event.data;
        console.log(topic)

        
        
    } catch (error) {
        console.error(error)
    }
})


export const functions = [publisherFn]