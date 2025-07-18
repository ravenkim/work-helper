import WhLayout from '@/shared/layout/WhLayout'
import SitesServer from '@/features/sites/Sites.server'

export default function Home() {
    return (
        <WhLayout>
            <SitesServer />
        </WhLayout>
    )
}
