import React from 'react'

const CheckoutSteps = ({checkStep} : {checkStep: number}) => {
    const steps = [
        {
            number: 1,
            title: 'Payment'
        },
        {
            number: 2,
            title: 'Processing'
        },
        {
            number: 3,
            title: 'Complete'
        }
    ]
  return (
    <div className='flex gap-2 justify-between'>
        {
            steps.map((step)=>(
                <div className='flex gap-4 items-center' key={step.title}>
                    <div className={`${checkStep >= step.number ? 'bg-green-400' :  ''} ${checkStep == step.number ? 'bg-black' : 'bg-gray-400'} p-3 px-5 rounded-full  text-white text-center`}>{step.number}</div>
                    {step.number <= steps.length -1 && (
                        <div className={`${checkStep >= step.number ? 'bg-green-400' :  'bg-gray-400'} w-20  h-0.5 bg-gray-300 mx-2`}>
                        </div>
                    )}
                </div>
            ))
        }
    </div>
  )
}

export default CheckoutSteps
