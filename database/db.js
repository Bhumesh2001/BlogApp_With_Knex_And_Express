const knex = require('knex')({
    client:'mysql',
    connection:{
        user:'root',
        host:'localhost',
        password:'1',
        database:'blogapp'
    }
})

const AllTable = function(){
    knex.schema.createTable('blogUser',(table)=>{
        table.increments('id').primary()
        table.string('Name').notNullable()
        table.string('Email').unique().notNullable()
        table.string('Password')
    }).then(()=>{
        console.log('Table Created...');
    }).catch(()=>{
        console.log('Table allready exist....');
    })
    
    knex.schema.createTable('blogPosts',(table)=>{
        table.increments('id').unique()
        table.string('Title').notNullable()
        table.string('Discription').notNullable()
        table.integer('UserId').notNullable()
    }).then(()=>{
        console.log('Table Created...');
    }).catch(()=>{
        console.log('Table allready exist....');
    })

    knex.schema.createTable('LikeDislike',(table)=>{
        table.increments('id').primary().notNullable()
        table.integer('userId').notNullable()
        table.integer('PostsId').notNullable()
        table.boolean('Like')
    })
    .then(()=>{
        console.log('Table Created...');
    }).catch(()=>{
        console.log('Table allready exist....');
    })
    
}
AllTable()

module.exports = knex