export default [
    {
        name: 'Project Name',
        type: 'input',
        key: 'name',
        required: true,
        rules: [
            {
                required: true,
                message: 'please input project name !'
            }
        ]
        
    },
    {
        name: 'Short Introduction',
        type: 'textarea',
        key: 'describe',
        required: true,
        rules: [
            {
                required: true,
                message: 'please input short introduction !'
            }
        ]
    },
    {
        name: 'Twitter',
        type: 'twitter',
        key: 'twitterUrl',
        required: true,
        rules: [
            {
                required: true,
                message: 'please bind your twitter !'
            }
        ]
    },
    {
        name: <span>Logo <br />(Image size: 300*300 px)</span>,
        type: 'logo',
        key: 'logo',
        required: true,
        rules: [
            {
                required: true,
                message: 'please bind your twitter !'
            }
        ]
    },
    {
        name: 'Project Status',
        type: 'radio',
        key: 'stage',
        required: true,
        items: [
            'Just an initial idea',
            'Idea with White Paper',
            'In early development',
            'In late stage of development',
            'Ready to launch',
            'Already launched'
        ],
        rules: [
            {
                required: true,
                message: 'please select your project status !'
            }
        ]
    },
    {
        name: 'Website',
        type: 'website',
        key: 'website',
        required: true,
        rules: [
            {
                required: true,
                message: 'please input your website !'
            }
        ]
    },
    {
        name: 'Email',
        type: 'input',
        key: 'email',
        required: true,
        rules: [
            {
                required: true,
                message: 'please input your email !'
            },
            {
                type: 'email',
                message: 'please input your correct email !'
            }
        ]
    },
    {
        name: 'Telegram',
        type: 'input',
        key: 'telegramUrl'
    },
    {
        name: 'Discord',
        type: 'input',
        key: 'discordUrl'
    },
    {
        name: 'Github',
        type: 'input',
        key: 'githubUrl'
    },
    {
        name: 'Token Symbol',
        type: 'input',
        key: 'tokenSymbol'
    },
    {
        name: 'Token Contract address',
        type: 'input',
        key: 'tokenContract'
    }
]