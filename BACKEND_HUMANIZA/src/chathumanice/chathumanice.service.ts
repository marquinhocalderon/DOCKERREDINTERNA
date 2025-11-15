import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChathumaniceDto } from './dto/create-chathumanice.dto';
import { UpdateChathumaniceDto } from './dto/update-chathumanice.dto';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { CuentaService } from 'src/cuenta/cuenta.service';

@Injectable()
export class ChathumaniceService {

  private readonly ai = new GoogleGenAI({}); // Usa la clave de entorno GEMINI_API_KEY automáticamente

  private openai: OpenAI;

  constructor(private readonly CuentaService: CuentaService) {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.YOUR_SITE_URL,
        'X-Title': process.env.YOUR_SITE_NAME,
      },
    });
  }

  async create(createChathumaniceDto: CreateChathumaniceDto): Promise<{ parrafo_rescrito: string }> {
    const { parrafo } = createChathumaniceDto;

    const models = [
      'google/gemini-2.0-flash-exp:free',
      'qwen/qwen3-235b-a22b-07-25:free',
      'moonshotai/kimi-k2:free',
      'qwen/qwen3-14b:free',
      'tngtech/deepseek-r1t2-chimera:free',
      'mistralai/mistral-small-3.2-24b-instruct:free',
      'qwen/qwen3-30b-a3b:free',
      'moonshotai/kimi-dev-72b:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'qwen/qwen3-8b:free',
      'mistralai/mistral-small-3.1-24b-instruct:free',
      'meta-llama/llama-3.3-70b-instruct:free',
    ];

    // Desordenar los modelos al azar
    const shuffledModels = models.sort(() => Math.random() - 0.5);

    const prompt = `Reescribe el siguiente parrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria. Usa conectores muy comunes y un lenguaje sencillo, con redacción natural, sin palabras rebuscadas, usando sinónimos simples que cualquiera pueda entender. No cometas errores ortográficos ni gramaticales.

Parrafo: ${parrafo}

Devuélveme únicamente el parrafo reescrito entre corchetes. Ejemplo: [parrafo aquí]`;

    let lastError: any = null;

    for (const model of shuffledModels) {
      try {
        const completion = await this.openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const result = completion.choices[0].message.content.trim();

        if (!result.startsWith('[') || !result.endsWith(']')) {
          console.warn(`Modelo: ${model} devolvió un formato inválido:`, result);
          continue; // Intenta con el siguiente modelo
        }

        const cleaned = result.slice(1, -1).trim();
        return { parrafo_rescrito: cleaned };
      } catch (error) {
        console.error(`Error con el modelo: ${model}`, error.message || error);
        lastError = error;
      }
    }

    // Si ningún modelo funcionó
    throw new Error(`Todos los modelos fallaron. Último error: ${lastError?.message || lastError}`);
  }

  async create2(createChathumaniceDto: CreateChathumaniceDto, idUsuario: number): Promise<{ parrafo_rescrito: string }> {
    const { parrafo } = createChathumaniceDto;

    const prompt = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria. 
Usa conectores muy comunes y un lenguaje sencillo, con redacción natural, sin palabras rebuscadas, 
usando sinónimos simples que cualquiera pueda entender. No cometas errores ortográficos ni gramaticales.

Párrafo: ${parrafo}

Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [parrafo aquí]`;

    const modelos = [
      { nombre: 'gemini-1.5-flash', descripcion: 'usando modelo gemini-1.5-flash' },
      { nombre: 'gemma-3-27b-it', descripcion: 'usando modelo gemma-3-27b-it' },
      { nombre: 'gemini-2.0-flash-lite', descripcion: 'usando modelo gemini-2.0-flash-lite' },
      { nombre: 'gemini-2.0-flash', descripcion: 'usando modelo gemini-2.0-flash' }
    ];

    for (const modelo of modelos) {
      try {
        console.log(`Humanizando con ${modelo.nombre}... (${modelo.descripcion})`);

        const response = await this.ai.models.generateContent({
          model: modelo.nombre,
          contents: prompt,
        });

        const text = response.text.trim();

        if (!text.startsWith('[') || !text.endsWith(']')) {
          throw new Error(`El modelo ${modelo.nombre} no devolvió el contenido esperado entre corchetes.`);
        }

        const cleaned = text.slice(1, -1).trim();

        // Actualizar la cuenta del usuario
        await this.CuentaService.create({ idUsuario: idUsuario.toString() });

        return { parrafo_rescrito: cleaned };
      } catch (error) {
        console.error(`❌ Falló el modelo ${modelo.nombre}:`, error.message);
        // continúa al siguiente modelo
      }
    }

    throw new Error('No se pudo generar el párrafo reescrito con ningún modelo disponible.');
  }

  async create3(createChathumaniceDto: CreateChathumaniceDto, idUsuario: number): Promise<{ parrafo_rescrito: string }> {
    const { parrafo } = createChathumaniceDto;

    const prompt = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria. 
Usa conectores muy comunes y un lenguaje sencillo, con redacción natural y fluida, sin palabras rebuscadas.
Evita resumir o eliminar ideas. Mantén la misma estructura del párrafo original y el mismo orden de las ideas.
Solo cambia algunas palabras por sinónimos fáciles y conectores más comunes. No cometas errores ortográficos ni gramaticales.

Párrafo: ${parrafo}

Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`;

    const modelos = [
      { nombre: 'gemma-3-27b-it', descripcion: 'usando modelo gemma-3-27b-it' },
      { nombre: 'gemini-1.5-flash', descripcion: 'usando modelo gemini-1.5-flash' },
      { nombre: 'gemini-2.0-flash-lite', descripcion: 'usando modelo gemini-2.0-flash-lite' },
      { nombre: 'gemini-2.0-flash', descripcion: 'usando modelo gemini-2.0-flash' }
    ];

    for (const modelo of modelos) {
      try {
        console.log(`Humanizando con ${modelo.nombre}... (${modelo.descripcion})`);

        const response = await this.ai.models.generateContent({
          model: modelo.nombre,
          contents: prompt,
        });

        const text = response.text.trim();

        if (!text.startsWith('[') || !text.endsWith(']')) {
          throw new Error(`El modelo ${modelo.nombre} no devolvió el contenido esperado entre corchetes.`);
        }

        let cleaned = text.slice(1, -1).trim();

        cleaned = cleaned.replace(/ {2,}/g, ' ');

        // Actualizar la cuenta del usuario
        await this.CuentaService.create({ idUsuario: idUsuario.toString() });

        return { parrafo_rescrito: cleaned };
      } catch (error) {
        console.error(`❌ Falló el modelo ${modelo.nombre}:`, error.message);
        // continúa al siguiente modelo
      }
    }

    throw new Error('No se pudo generar el párrafo reescrito con ningún modelo disponible.');
  }

  async create4(createChathumaniceDto: CreateChathumaniceDto, idUsuario: number,): Promise<{ parrafo_rescrito: string }> {
    const { parrafo } = createChathumaniceDto;

    //     const prompt = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria. 
    // Usa conectores muy comunes y un lenguaje sencillo, con redacción natural y fluida, sin palabras rebuscadas.
    // Evita resumir o eliminar ideas. Mantén la misma estructura del párrafo original y el mismo orden de las ideas.
    // Solo cambia algunas palabras por sinónimos fáciles y conectores más comunes. No cometas errores ortográficos ni gramaticales.

    // Párrafo: ${parrafo}

    // Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`;

    //     const prompt = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria del ultimo grado.
    // Usa conectores muy comunes y un lenguaje sencillo, con redacción natural y fluida, sin palabras rebuscadas.
    // Evita resumir o eliminar ideas. Mantén la misma estructura del párrafo original y el mismo orden de las ideas.
    // Solo cambia algunas palabras por sinónimos fáciles y conectores más comunes. No cometas errores ortográficos ni gramaticales.

    // ANTES DE REESCRIBIR: identifica la persona gramatical predominante (primera, segunda o tercera) y el tiempo verbal principal (pasado, presente o futuro) del párrafo original y RESPÉTALOS estrictamente. 
    // Si hay mezcla de personas o tiempos, conserva la misma mezcla y distribución. No cambies la voz (activa/pasiva) ni el modo verbal (indicativo/subjuntivo/imperativo) cuando aparezcan.

    // Párrafo: ${parrafo}

    // Devuélveme únicamente el párrafo reescrito entre corchetes sin errores ortográficos ni gramaticales. Ejemplo: [párrafo aquí]`;

    // const prompt1 = `Reescribe el siguiente párrafo en ESPAÑOL.
    // Usa conectores muy comunes y un lenguaje sencillo, con redacción natural y fluida, sin palabras rebuscadas.
    // Evita resumir o eliminar ideas. Mantén la misma estructura del párrafo original y el mismo orden de las ideas.
    // Solo cambia algunas palabras por sinónimos fáciles y conectores más comunes. No cometas errores ortográficos ni gramaticales.

    // ANTES DE REESCRIBIR: identifica la persona gramatical predominante (primera, segunda o tercera) y el tiempo verbal principal (pasado, presente o futuro) del párrafo original y RESPÉTALOS estrictamente. 
    // Si hay mezcla de personas o tiempos, conserva la misma mezcla y distribución. No cambies la voz (activa/pasiva) ni el modo verbal (indicativo/subjuntivo/imperativo) cuando aparezcan.

    // Párrafo: ${parrafo}

    // Devuélveme únicamente el párrafo reescrito entre corchetes sin errores ortográficos ni gramaticales. Ejemplo: [párrafo aquí]`;

    // const prompt2 = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria.
    // No cambies palabras técnicas, términos académicos ni variables.
    // Cambia únicamente los conectores por otros muy comunes y sencillos.
    // No repitas conectores en oraciones seguidas.

    // ANTES DE REESCRIBIR: identifica la persona gramatical predominante (primera, segunda o tercera) y el tiempo verbal principal (pasado, presente o futuro) del párrafo original y respétalos estrictamente.
    // Si hay mezcla de personas o tiempos, consérvalos.
    // No cambies la voz (activa/pasiva) ni el modo verbal.

    // No cometas errores ortográficos ni gramaticales. Ejemplo: ", y" no es correcto, debe ser " y " o "; y".

    // Párrafo: ${parrafo}

    // Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`;

    // const prompt3 = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria.

    // Sigue estas instrucciones al pie de la letra:

    // 1. No cambies palabras técnicas, términos académicos ni variables.
    // 2. ANTES DE REESCRIBIR: identifica la persona gramatical predominante (primera, segunda o tercera) y el tiempo verbal principal (pasado, presente o futuro) del párrafo original y respétalos estrictamente.
    // 3. Si hay mezcla de personas o tiempos, consérvalos.
    // 4. No cambies la voz (activa/pasiva) ni el modo verbal.
    // 5. Puedes cambiar los verbos por sinónimos simples y naturales, siempre respetando el tiempo verbal y la persona gramatical.
    // 6. Cambia también los conectores por otros muy comunes y sencillos, sin repetirlos en oraciones seguidas.
    // 7. No resumas ni agregues ideas.
    // 8. No cometas errores ortográficos ni gramaticales.
    // 9. No uses ", y" mejor usa un punto seguido y continúa con un conector.

    // Párrafo: ${parrafo} 

    // Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`;


    // const prompt4 = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria.

    // Instrucciones obligatorias:

    // 1. Solo podrás reemplazar palabras técnicas o términos académicos por sinónimos sencillos si:
    //    - Mantienen el mismo nivel académico.
    // 2. Respeta persona, tiempo verbal, voz y modo del texto original.
    // 3. Puedes cambiar los verbos por sinónimos simples, siempre manteniendo tiempo y persona.
    // 4. Cambia los conectores por otros comunes y sencillos, sin repetirlos en oraciones seguidas.
    // 5. No resumas ni agregues ideas. No cometas errores ortográficos ni gramaticales.
    // 6. ⚠️ Está prohibido usar ", y". Cada vez que aparezca, debes reemplazarlo por:
    //    - punto seguido + "Además" o "También" o "Por eso"
    //    - o reescribir la frase de forma natural sin la coma.
    // 7. ⚠️ Está prohibido usar muchas veces seguidas la estructura "a + verbo en infinitivo"
    // 8. ⚠️ Está prohibido cambiar las 10 primeras palabras con las que empieza el párrafo a menos que sea conector.

    // Párrafo: ${parrafo} 

    // Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`; 

    const prompt = `Reescribe el siguiente párrafo en ESPAÑOL como si lo hubiera redactado un alumno de secundaria.

Instrucciones obligatorias:

1. Respeta persona, tiempo verbal, voz y modo del texto original.
2. Puedes cambiar los verbos por sinónimos simples, siempre manteniendo tiempo y persona.
3. Cambia los conectores por otros comunes y sencillos, sin repetirlos en oraciones seguidas.
4. No resumas ni agregues ideas. No cometas errores ortográficos ni gramaticales.
5. ⚠️ Está prohibido usar ", y". Cada vez que aparezca, debes reemplazarlo por:
   - punto seguido + "Además" o "También" o "Por eso"
   - o reescribir la frase de forma natural sin la coma.
6. ⚠️ Está prohibido usar muchas veces seguidas la estructura "a + verbo en infinitivo"
7. ⚠️ Está prohibido cambiar las 10 primeras palabras con las que empieza el párrafo a menos que sea conector.
8. ⚠️ Está prohibido alterar el formato de citas ya sea APA, Vancouver, ISO 690 o MLA.

Párrafo: ${parrafo} 

Devuélveme únicamente el párrafo reescrito entre corchetes. Ejemplo: [párrafo aquí]`;

    // Claves de API de Gemini
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
    ];

    const modelos = [
      { nombre: 'gemma-3-27b-it', descripcion: 'usando modelo gemma-3-27b-it' },
      { nombre: 'gemini-1.5-flash', descripcion: 'usando modelo gemini-1.5-flash' },
      { nombre: 'gemini-2.0-flash-lite', descripcion: 'usando modelo gemini-2.0-flash-lite' },
      { nombre: 'gemini-2.0-flash', descripcion: 'usando modelo gemini-2.0-flash' },
    ];

    for (const apiKey of apiKeys) {
      const ai = new GoogleGenAI({ apiKey });

      for (const modelo of modelos) {
        try {
          console.log(`Intentando con API KEY número ${apiKeys.indexOf(apiKey) + 1} y modelo ${modelo.nombre}`);

          const response = await ai.models.generateContent({
            model: modelo.nombre,
            contents: prompt,
          });

          const text = response.text.trim();

          if (!text.startsWith('[') || !text.endsWith(']')) {
            throw new Error(`⚠️ Modelo ${modelo.nombre} no devolvió el contenido esperado entre corchetes.`);
          }

          let cleaned = text.slice(1, -1).trim();
          cleaned = cleaned.replace(/ {2,}/g, ' '); // Elimina dobles espacios

          // 🚨 Si esto falla, salta fuera y detiene todo
          await this.CuentaService.create({ idUsuario: idUsuario.toString() });

          return { parrafo_rescrito: cleaned };

        } catch (error) {
          // Si falla CuentaService, no seguimos más, detenemos todo
          if (error.message.includes('Límite de peticiones') || error instanceof HttpException) {
            console.error(`❌ Error al registrar en CuentaService: ${error.message}`);
            if (error.status == 429) {
              throw new HttpException(`${error.message}`, HttpStatus.TOO_MANY_REQUESTS);
            }
            else {
              throw new HttpException(`${error.message}`, HttpStatus.CONFLICT);
            }
          }

          console.error(`❌ Falló con API KEY ${apiKey?.slice(-4)} y modelo ${modelo.nombre}: `); //${error.message}
          // Continúa con siguiente modelo/API solo si es error del modelo
        }
      }
    }

    throw new Error('❌ No se pudo generar el párrafo reescrito con ninguna API ni modelo disponible.');
  }



  findAll() {

    return 'This action returns all chathumanice';
  }

  findOne(id: number) {
    return `This action returns a #${id} chathumanice`;
  }

  update(id: number, updateChathumaniceDto: UpdateChathumaniceDto) {
    return `This action updates a #${id} chathumanice`;
  }

  remove(id: number) {
    return `This action removes a #${id} chathumanice`;
  }
}
