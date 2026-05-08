# IHSA App

App de cripto en React Native. Lista de monedas, detalle con gráfico de histórico y precio en vivo por WebSocket. TypeScript estricto, MVVM y caching local.

## Cómo correrlo

Requisitos:

- Node >=20
- Yarn
- Xcode / Android Studio + JDK 17
- CocoaPods (para iOS)

```bash
yarn install
cd ios && pod install && cd ..   # solo iOS
yarn start
```

En otra terminal:

```bash
yarn ios       # iOS
yarn android   # Android
```

Tests:

```bash
yarn test
```

APK de release:

```bash
yarn apk:release
```

El APK queda en `android/app/build/outputs/apk/release/`.

## APK

Descargable acá: https://drive.google.com/file/d/148iCUOMw44gvUmS664rTJP3svbNLONhL/view?usp=sharing

## Decisiones

Elegí **MVVM** porque me da separation of concerns y me ordena el código: cada cosa tiene su responsabilidad. La view solo muestra, el viewcontroller maneja la lógica de la vista, el viewmodel orquesta la lógica de negocio y consume de los modelos la API o el cache.

El **appState** lo puse en el viewmodel del app navigator para tener un lugar centralizado para los estados globales de la app (online/offline, foreground/background, etc.).

Para estado global elegí **Zustand** (por ejemplo `isOnline`). Sin provider, sin boilerplate.

Cuando carga la app el loading se ve una sola vez: después guardo los datos en local con **MMKV** a modo de caching, así el usuario ya tiene datos cargados al ingresar.

Tanto el **polling** del menú como el **WebSocket** del precio en vivo se pausan y reanudan automáticamente según el ciclo de vida de la app y la conectividad: cuando se va a background o se pierde la red, los efectos se limpian y se cierran, al volver a foreground / recuperar conexión, reconectan solos. Así no mantengo conexiones abiertas innecesariamente ni proceso mensajes con la app fuera de foco.

El **Error Boundary** lo puse en el chart porque si llega mal un dato es muy probable que eso rompa. Obvio, con más tiempo me hubiese gustado manejar mejor ese error.

En las preguntas previas a la entrevista me preguntaron por **backoff**, así que lo apliqué en el WebSocket. Lo dejé en máximo 3 reintentos para seguir un poco la misma estructura del MenuViewController.

En el menú puse un **polling** para darle un aspecto de real-time a la app.

Con más tiempo, algun dato en el chart también hubiese sido por WebSocket, pero por simplicidad solo lo usé para el precio actual.

Vas a ver `setTimeout` antes de setear data del chart y en el `onEndReached` de la lista. Son a propósito: para que se vea el **skeleton** (sino pasa muy rápido) y para mostrar el **infinite scroll** en la lista, ya que es client side y prácticamente no hay demora porque no se hace un GET y no se aprecia. El infinite scroll con client-side lo hice para no castigar dispositivos low-end.

Memoicé el **chart** con `React.memo` porque es más costoso de renderizar que otras cosas. También memoicé la lista.

Las **animaciones** están en el skeleton del chart y en el switch del orden alfabético (Reanimated) para replicar el switch de iOS.

## Librerías

- **react-native-wagmi-charts** para los gráficos. La elegí porque es robusta y está hecha por la gente de Coinjar.
- **FlashList** de Shopify para la lista.
- **MMKV** para datos locales, más eficiente que AsyncStorage.
- **React Navigation** y **Reanimated**, las opciones más maduras del ecosistema para navegación y animaciones nativas.
- **Zustand** para estado global.
- **NetInfo** para detectar online/offline.

## Qué haría con más tiempo

- Agregar algún filtro más.
- Mejorar el estilo.
- Skeleton también en la carga de la lista (hoy solo está en el chart).
- Un botón de goBack explícito en CryptoDetail.
- Componetizar el header y patrones similares por si más adelante necesito reutilizarlos (hoy no se repiten, es preventivo).
- El chart por WebSocket.
- Mejorar el manejo del error en el Error Boundary.
