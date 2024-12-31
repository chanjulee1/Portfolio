import React from 'react'
import { NavLink } from 'react-router-dom'

var title = {
    color: "white"
}
export default function Footer() {
    return (
        <footer className="text-center text-lg-start bg-primary" Style="position:fixed; bottom:0px;width:100%;">

            <div className="text-center p-3 fs-5">
                <NavLink to="/" Style="text-decoration:none;">
                    &nbsp;<i Style={title}>Fake Stack </i><b Style="color:black;">Overflow</b>
                </NavLink>

            </div>
 

        </footer>
    )
}
