export default function AddressInputs({addressProps,setAddressProp,disable=true}){
    const {phone,streetAddress,postalCode,city,country} = addressProps;
    return (
        <>
            <label>Phone</label>
            <input
                disabled={disabled}
                type='tel' placeholder="Phone number"
                value={phone || ''} onChange={e =>setAddressProp('phone',e.target.value)}
            />
            <label>Street address</label>
            <input 
                disabled={disabled}
                type="text" placeholder="Street addess"
                value={streetAddress || ''} onChange={e=>setAddressProp('streetAddress',e.target.value)}
            />
            <div className="grid grid-clos-2 gap-2">
                <div>
                    <label Postal code></label>
                    <input
                        disabled={disabled}
                        type="text" placeholder="Postal cdode"
                        value={postalCode || ''} onChange={e => setAddressProp('postalCode',e.target.value)}
                    />
                </div>
                <div>
                    <label>City</label>
                    <input
                        disabled={disabled}
                        type="text" placeholder="City"
                        value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
                    />
                </div>
            </div>
            <label>Country</label>
            <input
                disabled={disabled}
                type="text" placeholder="Country"
                value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
            />
        </>
    );
}