'use client'

const Header = () => {
    return (
        <header className="flex h-[65px] items-center justify-between border-b border-solid border-b-[#e7edf4] px-10 py-3 whitespace-nowrap">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-[#0d151c]">
                    제목
                </div>
                <div className="flex items-center gap-9">
                    {/*  메뉴 생기면*/}
                </div>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                {/*       오른쪽 영역  */}
            </div>
        </header>
    )
}

export default Header
