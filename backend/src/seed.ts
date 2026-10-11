import {prisma} from "./lib/db_init.js"
async function create(){
    await prisma.user.createMany({
        data:[
            {name:"Himanshu",email:"himanshupandey2003@gmail.com",password:"himanshu"},
            {name:"Vansh",email:"vansh@gmail.com",password:"vansh"}

        ]
    })

}

create().then(()=>prisma.$disconnect());