export const category = [
    {
        name: '개발 / Development',
        id: 'dev',
        children: [
            {
                name: '프론트엔드 / Frontend',
                id: 'fe',
                children: [
                    {
                        name: '공식 문서 / Official Documentation',
                        id: 'fe-doc',
                    },
                    {
                        name: '추천 크롬 개발 도구 / Recommended Chrome Dev Tools',
                        id: 'fe-chrome-dev-tool',
                    },
                    {
                        name: '패키지 / Packages',
                        id: 'fe-package',
                        children: [
                            {
                                name: '애니메이션, 비주얼 / Animation, Visual',
                                id: 'fe-package-ani-visual',
                            },
                            {
                                name: '차트 / Chart',
                                id: 'fe-package-chart',
                            },
                        ],
                    },
                    {
                        name: '추천 블로그 / Recommended Blogs',
                        id: 'fe-blog',
                    },
                ],
            },
            {
                name: '백엔드 / Backend',
                id: 'be',
                children: [
                    {
                        name: '공식 문서 / Official Documentation',
                        id: 'be-doc',
                    },
                ],
            },
            {
                name: '데이터베이스 / Database',
                id: 'db',
                children: [
                    {
                        name: '공식 문서 / Official Documentation',
                        id: 'db-doc',
                    },
                ],
            },
            {
                name: '모바일 / Mobile',
                id: 'mobile',
                children: [
                    {
                        name: '공식 문서 / Official Documentation',
                        id: 'mobile-doc',
                    },
                ],
            },
            {
                name: '클라우드 / Cloud',
                id: 'cloud',
                children: [
                    {
                        name: '공식 문서 / Official Documentation',
                        id: 'cloud-doc',
                    },
                ],
            },
        ],
    },
    {
        name: '디자인 / Design',
        id: 'design',
        children: [
            {
                name: '색상 / Colors',
                id: 'colour',
            },
            {
                name: '소스, 리소스 / Sources, Resources',
                id: 'design-assets',
            },
        ],
    },
    {
        name: '문서화 / Documentation',
        id: 'doc',
        children: [
            {
                name: '색상 / Colors',
                id: 'colour',
            },
            {
                name: '소스, 리소스 / Sources, Resources',
                id: 'doc-assets',
            },
        ],
    },
    {
        name: 'AI / AI',
        id: 'ai',
        children: [
            {
                name: '디자인 / Design',
                id: 'ai-design',
            },
            {
                name: '채팅 / Chat',
                id: 'ai-chat',
            },
            {
                name: '로컬 실행 / Local Execution',
                id: 'ai-local',
            },
        ],
    },
]

export default category