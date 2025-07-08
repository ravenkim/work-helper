import SiteCategoryAccordion from 'src/features/components/ResourceAccordion.tsx'



const Home = () => {
    return  <div
        className={'flex flex-col h-full items-center w-screen  '}
    >

        <div
            className={'w-[1280px] pt-10 '}
        >
            <SiteCategoryAccordion />
        </div>


    </div>
}

export default Home
