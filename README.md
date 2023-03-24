<h1 align="center">
   <b>
        <a href="https://github/wasyto/api-worker.com"><img src="https://avatars.githubusercontent.com/u/128638283?v=4" /></a><br>
    </b>
</h1>

# Browser Support

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                          | Latest ✔                                                                                             | Latest ✔                                                                                          | Latest ✔                                                                                       | Latest ✔                                                                                    | 11 ✔                                                                                                                                    |



## Installing

### Package manager

Using npm:

```bash
$ npm install api-worker
```

Using bower:

```bash
$ bower install api-worker
```

Using yarn:

```bash
$ yarn add api-worker
```

Using pnpm:

```bash
$ pnpm add api-worker
```

Once the package is installed, you can import the library using `import` or `require` approach:

```js
import { apiWorker } from 'api-worker';
```

## Example

First declare, yours endpoint in a file.
-services.ts
```js
import { apiWorker } from 'api-worker';

// First you need configurate, your endpoint
// services/endpoints.ts
export function getExample({
  onSuccess = (data: any) => {},
  onError = (data: any) => {},
}: {
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
}) {
  apiWorker({
    // Is comming a new feature, for you declare only, your endpoint
    url: 'https://api.github.com/orgs/Wasyto/',
    method: 'GET',
    onSuccess,
    onError,
  });
}
export function setExample({
  body,
  onSuccess = (data: any) => {},
  onError = (data: any) => {},
}: {
  body = {}
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
}) {
  apiWorker({
    // Is comming a new feature, for you declare only, your endpoint
    url: 'https://api.github.com/orgs/Wasyto/',
    method: 'POST',
    body = body,
    onSuccess,
    onError,
  });
}
```


//Second and last step, is you call your function.
```tsx
import { setExample, getExample } from "./services.ts"
import useEffect from "react"
   
function App(){
 UseEffect(() => {
   setExample({
     body:  {example: 'Wasyto'},
     onSucces: (data) => console.log(data),
     onError: (error) => console.log(error),
   });
   getExample({
     onSucces: (data) => console.log(data),
     onError: (error) => console.log(error),
   });
}, [])  
   return (
      <div className="app"></div>
   )
}
```
