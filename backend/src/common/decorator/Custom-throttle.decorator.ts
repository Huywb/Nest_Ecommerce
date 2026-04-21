import { Throttle } from "@nestjs/throttler"


export const StricThrottle = ()=>{
    return Throttle({
        default: {
            ttl: 1000,
            limit: 3
        }
    })
}

export const ModerateThrottle = ()=>{
    return Throttle({
        default: {
            ttl: 1000,
            limit: 5
        }
    })
}

export const RelaxedThrottle = ()=>{
    return Throttle({
        default: {
            ttl: 1000,
            limit: 20
        }
    })
}