import Link from "next/link"


export default function userDasboard () {
    // get the user id from params

    // get all data required for the dashbaord from db based on id

    let slug ='kfc'
    
    return (
        <div>
            <h1>this is the user dashbaord</h1>

                
            <Link href={`/restboard/${slug}`}>
                go to a restboard
            </Link>
        </div>
    )
}