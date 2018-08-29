# Markdown Links

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...), y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato `Markdown`, para verificar los links que contengan y reportar
algunas estadísticas.

### CLI (Línea de comando)

El ejecutable de nuestra aplicación debe poder ejecutarse de la siguiente
manera a través de la terminal:

Para la instalacin del paquete realizar el siguiente comando.

![intalación](https://scontent.flim15-2.fna.fbcdn.net/v/t1.15752-9/40337148_295654604575946_1756004216557535232_n.jpg?_nc_cat=0&oh=fe5f5ba47f416557c6f0a0ed20bb6802&oe=5BF577AE)

Por ejemplo:

![Comando](https://scontent.flim15-2.fna.fbcdn.net/v/t1.15752-9/40291367_291476788317558_6832892118638264320_n.jpg?_nc_cat=0&oh=97261c378ee9def6892ff2489f234518&oe=5C000A93)


El comportamiento de este comando es identificar el archivo markdown (a partir de la ruta que recibe como
argumento), analizar el archivo Markdown e imprimir los links que vaya
encontrando, junto con la ruta del archivo donde aparece y el texto
que hay dentro del link (truncado a 50 caracteres).


#### Options

##### `--validate`

Si pasamos la opción `--validate`, el módulo debe hacer una petición HTTP para
averiguar si el link funciona o no. Si el link resulta en una redirección a una
URL que responde ok, entonces consideraremos el link como ok.

Por ejemplo:

![Comando Validate ](https://scontent.flim15-2.fna.fbcdn.net/v/t1.15752-9/40310617_304931830282025_8250143593021308928_n.jpg?_nc_cat=0&oh=caaaf4be900a1f12b59d9ceb0bd5043d&oe=5C037131)


Vemos que el _output_ en este caso incluye la palabra `ok` o `fail` después de
la URL, así como el status de la respuesta recibida a la petición HTTP a dicha
URL.

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

![Comando Stats ](https://scontent.flim15-2.fna.fbcdn.net/v/t1.15752-9/40321055_331904064218281_8763260045929480192_n.jpg?_nc_cat=0&oh=629ae9d50335dee7d9522b7b795e2698&oe=5BFD48A1)

También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación.

![Comando Validate Stats](https://scontent.flim15-2.fna.fbcdn.net/v/t1.15752-9/40361859_455029035017455_8726487175891255296_n.jpg?_nc_cat=0&oh=81f86e1630ff7c2b0cbb9040872a3e29&oe=5BFEC9BE)


