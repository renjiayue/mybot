const { Wechaty,Contact,Room, config,Message,Friendship} = require('wechaty')
// const { PuppetPadplus } =  require('wechaty-puppet-padplus')
// const { hostie } =  require('wechaty-puppet-hostie')
const { puppetService } =  require('wechaty-puppet-service')
const botConfig = require('./botConfig')

class BotUtil {
    constructor(){
        const token = botConfig.bot.token
        this.bot = new Wechaty({
            // profile : config.default.DEFAULT_PROFILE,
            // puppet: new PuppetPadplus({
            //   token: botConfig.bot.token,
            // }),	
            puppet: 'wechaty-puppet-service',
            puppetOptions: {
                token,
            }
            // name: botConfig.bot.name, 
          
          }),
        //   this.bot.start()
        this.adminList = new Array()
    }
    //  mybot = {a:1}
     async loadAdmin(){
        // let bot = this.mybot
        // console.log(this.bot)
        const personAdmin = await this.bot.Contact.find({id: 'Emp-yue'})
        this.adminList.push(personAdmin)
        const roomAdmin = await this.bot.Room.find({topic: 'rjyma'})
        this.adminList.push(roomAdmin)
    }
    /**
     * 
     * @param {String} wxid 
     */
     async findSomeOneByWxid(wxid){
        return await this.bot.Contact.find({id: wxid})
    }

    async sendStringMessageToAdmin(msg){
        // console.log(this.adminList)
        if(this.adminList.length==0){
            await this.loadAdmin();
          }
          // console.log(adminList)
          if(this.adminList.length>0)
          for(let cont in this.adminList){
            if(this.adminList[cont]!=null){
                this.adminList[cont].say(msg)
            }
            
          }
    }
    /**
     * 发送文本消息给多人
     * @param {string} msg 
     * @param {Array} to wxid 的集合
     */
    async sendStringMessageToManyPerson(msg,to){
        if(to.length>0){
            for(let i in to){
                if(to[i]!=null){
                    let person = await this.bot.Contact.find({id: to[i]})
                    if(person){
                        person.say(msg)
                    }
                }
            }
        }
    }
     /**
     * 发送文本消息给单人
     * @param {string} msg 
     * @param {string} to wxid
     */
    async sendStringMessageToOne(msg,to){
        if(to){
            console.log('发送消息给:'+to)
            const person = await this.bot.Contact.find({id: to})
            console.log(person)
            if(person){
                person.say(msg)
            }
        }
    }
}
module.exports =  new BotUtil()