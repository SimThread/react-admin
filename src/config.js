
console.log('node_env:', process.env)
export const API_ROOT = (process.env.NODE_ENV === 'production') ?
    'http://api.dot2thread.com' :
    ''