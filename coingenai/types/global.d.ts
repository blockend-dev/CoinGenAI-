// types/global.d.ts
declare module '*.html' {
    const content: string
    export default content
  }
  
  declare module '@mapbox/node-pre-gyp' {
    const value: any
    export = value
  }
  
  declare module 'aws-sdk' {
    const value: any
    export = value
  }
  
  declare module 'mock-aws-s3' {
    const value: any
    export = value
  }
  
  declare module 'nock' {
    const value: any
    export = value
  }
  
  declare module 'rimraf' {
    const value: any
    export = value
  }