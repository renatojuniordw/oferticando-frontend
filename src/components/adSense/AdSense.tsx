import { useEffect } from 'react'

const AdSense = () => {
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch (e) {
            console.error(e)
        }
    }, [])

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-6897422992813570"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
            data-adtest="on"
        ></ins>
    )
}

export default AdSense;