/**
 * @openapi
 * components:
 *   schemas:
 *     DeliveryInput:
 *       type: object
 *       required:
 *         - origen
 *         - destino
 *         - tipo
 *         - cantidad
 *         - responsableId
 *         - transporte
 *       properties:
 *         origen:
 *           type: string
 *           example: Quibdó
 *         destino:
 *           type: string
 *           example: Istmina
 *         tipo:
 *           type: string
 *           example: Alimentos
 *         cantidad:
 *           type: integer
 *           example: 120
 *         responsableId:
 *           type: integer
 *           example: 2
 *         transporte:
 *           type: string
 *           example: Camión CHO-450
 *
 *     Delivery:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: ENT-2026-005
 *         origen:
 *           type: string
 *           example: Quibdó
 *         destino:
 *           type: string
 *           example: Istmina
 *         tipo:
 *           type: string
 *           example: Alimentos
 *         cantidad:
 *           type: integer
 *           example: 120
 *         responsableId:
 *           type: integer
 *           example: 2
 *         responsable:
 *           type: string
 *           example: Diana Córdoba
 *         transporte:
 *           type: string
 *           example: Camión CHO-450
 *         estado:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - Preparando
 *             - En tránsito
 *             - Entregada
 *           example: Pendiente
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: integer
 *           example: 1
 *         receivedAt:
 *           type: string
 *           nullable: true
 *           format: date-time
 *         receivedBy:
 *           type: integer
 *           nullable: true
 *         receivedByName:
 *           type: string
 *           nullable: true
 *         events:
 *           type: array
 *           items:
 *             type: object
 *
 * /api/deliveries:
 *   get:
 *     tags:
 *       - Entregas
 *     summary: Consultar entregas
 *     description: Retorna las entregas visibles para el usuario autenticado y permite aplicar filtros.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por ID, origen, destino, tipo, responsable o transporte.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - Preparando
 *             - En tránsito
 *             - Entregada
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: responsibleId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       401:
 *         description: No autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Entregas
 *     summary: Crear una entrega
 *     description: Crea una nueva entrega. Disponible para Coordinador logístico y Administrador.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryInput'
 *     responses:
 *       201:
 *         description: Entrega creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Revisa los datos del formulario.
 *                 fieldErrors:
 *                   type: object
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permisos.
 *
 * /api/deliveries/history:
 *   get:
 *     tags:
 *       - Entregas
 *     summary: Consultar historial de entregas
 *     description: Retorna únicamente entregas cuyo estado es Entregada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: responsibleId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       401:
 *         description: No autenticado.
 *
 * /api/deliveries/{id}:
 *   get:
 *     tags:
 *       - Entregas
 *     summary: Consultar una entrega
 *     description: Obtiene el detalle de una entrega específica.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ENT-2026-001
 *     responses:
 *       200:
 *         description: Entrega encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       403:
 *         description: La entrega no corresponde al transportador autenticado.
 *       404:
 *         description: La entrega no existe.
 *
 *   patch:
 *     tags:
 *       - Entregas
 *     summary: Editar una entrega
 *     description: Permite modificar una entrega únicamente mientras esté en estado Pendiente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ENT-2026-003
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryInput'
 *     responses:
 *       200:
 *         description: Entrega actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Datos inválidos.
 *       403:
 *         description: Usuario sin permisos.
 *       404:
 *         description: Entrega inexistente.
 *       409:
 *         description: La entrega ya no está en estado Pendiente.
 *
 *   delete:
 *     tags:
 *       - Entregas
 *     summary: Eliminar una entrega
 *     description: Elimina una entrega únicamente cuando su estado es Pendiente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ENT-2026-003
 *     responses:
 *       200:
 *         description: Entrega eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Entrega eliminada correctamente.
 *                 id:
 *                   type: string
 *                   example: ENT-2026-003
 *       403:
 *         description: Usuario sin permisos.
 *       404:
 *         description: Entrega inexistente.
 *       409:
 *         description: Solo se eliminan entregas pendientes.
 *
 * /api/deliveries/{id}/status:
 *   patch:
 *     tags:
 *       - Entregas
 *     summary: Actualizar estado de una entrega
 *     description: Cambia el estado siguiendo el flujo Pendiente → Preparando → En tránsito.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ENT-2026-003
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum:
 *                   - Preparando
 *                   - En tránsito
 *                 example: Preparando
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Estado solicitado no permitido.
 *       403:
 *         description: Usuario sin permisos.
 *       404:
 *         description: Entrega inexistente.
 *       409:
 *         description: Transición de estado no permitida.
 *
 * /api/deliveries/{id}/reception:
 *   post:
 *     tags:
 *       - Entregas
 *     summary: Confirmar recepción
 *     description: Confirma la recepción de una entrega que se encuentre En tránsito y la cambia a Entregada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ENT-2026-001
 *     responses:
 *       200:
 *         description: Recepción confirmada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       403:
 *         description: Usuario sin permisos.
 *       404:
 *         description: Entrega inexistente.
 *       409:
 *         description: La entrega no se encuentra en tránsito o ya fue recibida.
 */
