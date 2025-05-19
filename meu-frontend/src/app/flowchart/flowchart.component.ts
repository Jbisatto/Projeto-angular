import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, input, Input } from '@angular/core';
import BpmnModdle from 'bpmn-moddle';
import minimapModule from 'diagram-js-minimap';
import BpmnJS from 'bpmn-js/lib/Modeler';
import { layoutProcess } from 'bpmn-auto-layout';

interface Etapa {
  id: string;
  denominacao: string;
  codigoTotal: string;
  tipo: string;
}

interface Link {
  source: string;
  target: string;
}

interface ZoomScroll {
  stepZoom(step: number): void;
  reset(): void;
}

@Component({
  selector: 'app-bpmn-editor',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss'],
  standalone: true,
})
export class BpmnEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ref', { static: true }) private el!: ElementRef;

  bpmnJS!: BpmnJS;
  etapas: Etapa[] = [];

  @Input() modoInfo: boolean = true;

  jsonData = {
    etapas: [
      { id: 'INI1', denominacao: 'Etapa Início', codigoTotal: '001.001', tipo: 'INICIO' },
      { id: 'TAR2', denominacao: 'Tarefa 01', codigoTotal: '002.002', tipo: 'DECISAO' },
      { id: 'TAR3', denominacao: 'Tarefa 02', codigoTotal: '002.002', tipo: 'TAREFA' },
      { id: 'TAR4', denominacao: 'Tarefa 03', codigoTotal: '002.002', tipo: 'TAREFA' },
      { id: 'TAR5', denominacao: 'Tarefa 04', codigoTotal: '002.002', tipo: 'TAREFA' },
      { id: 'TAR6', denominacao: 'Tarefa 05', codigoTotal: '002.002', tipo: 'TAREFA' },
      { id: 'TAR7', denominacao: 'Tarefa 06', codigoTotal: '002.002', tipo: 'TAREFA' },
      { id: 'FIM3', denominacao: 'Caio', codigoTotal: '003.0023', tipo: 'FIM' }
    ],
    links: [
      { source: 'INI1', target: 'TAR2', passou: true },
      { source: 'TAR2', target: 'TAR3', passou: true },
      { source: 'TAR2', target: 'TAR4', passou: true },
      { source: 'TAR3', target: 'TAR5', passou: true },
      { source: 'TAR4', target: 'TAR5', passou: true },
      { source: 'TAR5', target: 'TAR6', passou: true },
      { source: 'TAR6', target: 'TAR7', passou: true },
      { source: 'TAR7', target: 'FIM3', passou: false }
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
    this.etapas = this.jsonData.etapas;
    const additionalModules = [];
  
    additionalModules.push(minimapModule);
    // additionalModules.push(BpmnColorPickerModule);

    additionalModules.push({
      __init__: ['contextPadProvider'],
      contextPadProvider: ['value', null]
    });
  
    if (this.modoInfo) {
      additionalModules.push({
        __init__: ['paletteProvider'],
        paletteProvider: ['value', null]
      });
    }
    this.bpmnJS = new BpmnJS({
      additionalModules
    });
    this.createBPMNXML2();
  }

  ngAfterViewInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
    const eventBus: any = this.bpmnJS.get('eventBus');

    eventBus.on('element.dblclick', 10000, (event: any) => {
      // Seu código se quiser...
      return false;
    });

    const tooltip = document.getElementById('custom-tooltip');

    this.bpmnJS.on('element.hover', (event: any) => {
      const { element } = event;

      if (element.labelTarget) return;

      const tiposIgnorados = ['bpmn:Process', 'bpmn:SequenceFlow', 'bpmndi:BPMNPlane'];
      if (tiposIgnorados.includes(element.businessObject?.$type)) return;

      const etapa = this.etapas.find(e => e.id === element.businessObject?.id);
      if (!etapa) return;
      if (!tooltip) return;

      const canvas = this.bpmnJS.get('canvas') as import('diagram-js/lib/core/Canvas').default;
      const bbox = canvas.getAbsoluteBBox(element);

      tooltip.innerText = etapa.codigoTotal;

      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const viewportWidth = window.innerWidth;
      const spaceAbove = bbox.y;

      // Calcula posição horizontal, limitando para não sair da tela
      let left = bbox.x + bbox.width / 2;
      if (left - tooltipWidth / 2 < 0) {
        left = tooltipWidth / 2;
      } else if (left + tooltipWidth / 2 > viewportWidth) {
        left = viewportWidth - tooltipWidth / 2;
      }
      tooltip.style.left = left + 'px';

      if (spaceAbove < tooltipHeight + 20) {
        tooltip.classList.add('down');
        tooltip.style.top = (bbox.y + bbox.height + 50) + 'px';
      } else {
        tooltip.classList.remove('down');
        tooltip.style.top = (bbox.y - tooltipHeight - 2) + 'px';
      }

      tooltip.style.display = 'block';
    });

    this.bpmnJS.on('element.out', () => {
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    });
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  async createBPMNXML2() {
    const moddle = new BpmnModdle();
    const definitions = moddle.create('bpmn:Definitions', {
      targetNamespace: 'Pública tecnologia'
    });

    const bpmnProcess = moddle.create('bpmn:Process', { id: 'P1' });
    const bpmnDiagram = moddle.create('bpmndi:BPMNDiagram', { id: 'Diagram1' });
    const bpmnPlane = moddle.create('bpmndi:BPMNPlane', { id: 'Plane1', bpmnElement: bpmnProcess });

    const elementMap: { [id: string]: any } = {};

    if (this.etapas) {
      let idAux = 0;
      this.etapas.forEach(etapa => {
        let element;
        if (etapa.tipo === "INICIO") {
          element = moddle.create('bpmn:StartEvent', { id: etapa.id, name: etapa.denominacao, idEtapa: 8 });
        } else if (etapa.tipo === "TAREFA") {
          element = moddle.create('bpmn:Task', { id: etapa.id, name: etapa.denominacao, idEtapa: idAux++ });
        } else if (etapa.tipo === "DECISAO") {
          element = moddle.create('bpmn:ExclusiveGateway', { id: etapa.id, name: etapa.denominacao, idEtapa: idAux++ });
        } else if (etapa.tipo === "FIM") {
          element = moddle.create('bpmn:EndEvent', { id: etapa.id, name: etapa.denominacao });
        }

        if (element) {
          bpmnProcess.get('flowElements').push(element);
          elementMap[etapa.id] = element;

          const bpmnShape = moddle.create('bpmndi:BPMNShape', { id: 'CONF_' + etapa.id, bpmnElement: element });
          bpmnPlane.get('planeElement').push(bpmnShape);
        }
      });

      // Criar os SequenceFlows
      this.jsonData.links.forEach((link: any, index: number) => {
        const source = elementMap[link.source];
        const target = elementMap[link.target];

        if (source && target) {
          const sequenceFlow = moddle.create('bpmn:SequenceFlow', {
            id: `Flow_${index}`,
            sourceRef: source,
            targetRef: target
          });

          bpmnProcess.get('flowElements').push(sequenceFlow);

          if (!source.outgoing) {
            source.outgoing = [];
          }
          source.outgoing.push(sequenceFlow);

          if (!target.incoming) {
            target.incoming = [];
          }
          target.incoming.push(sequenceFlow);
        }
      });

      definitions.get('rootElements').push(bpmnProcess);
    }

    bpmnDiagram.set('plane', bpmnPlane);
    definitions.get('diagrams').push(bpmnDiagram);

    const { xml: xmlStrUpdated } = await moddle.toXML(definitions);
    const diagramWithLayoutXML = await layoutProcess(xmlStrUpdated);

    await this.bpmnJS.importXML(diagramWithLayoutXML);

    const canvas: any = this.bpmnJS.get('canvas');
    canvas.zoom('fit-viewport');
    canvas.scroll({ dx: 0, dy: 200 });

    const modeling = this.bpmnJS.get('modeling') as any;
    const elementRegistry = this.bpmnJS.get('elementRegistry') as any;

    this.jsonData.links.forEach((link, index) => {
      const flowId = `Flow_${index}`;
      const element = elementRegistry.get(flowId);
      if (element) {
        if (link.passou && !this.modoInfo) {
          modeling.setColor(element, {
            stroke: 'red'
          });
        } else {
          modeling.setColor(element, {
            stroke: 'black'
          });
        }
      }
    });

    elementRegistry.getAll().forEach((element: any) => {
      if (element.type === 'bpmn:StartEvent') {
        modeling.setColor(element, {
          fill: '#c8e6c9',
          stroke: '#205022'
        });
      }

      if (element.type === 'bpmn:Task') {
        modeling.setColor(element, {
          fill: '#bbdefb',
          stroke: '#0d4372'
        });
      }

      if (element.type === 'bpmn:ExclusiveGateway') {
        modeling.setColor(element, {
          fill: '#ffe0b2',
          stroke: '#6b3c00'
        });
      }

      if (element.type === 'bpmn:EndEvent') {
        modeling.setColor(element, {
          fill: '#ffcdd2',
          stroke: '#831311'
        });
      }
    });
  }


  viewXML(): void {
    this.bpmnJS.saveXML().then(({ xml }) => console.log(xml));
  }

  zoomMenos() {
    const zoomScroll = this.bpmnJS.get('zoomScroll') as ZoomScroll;
    zoomScroll.stepZoom(-1);
  }

  zoomReset() {
    const zoomScroll = this.bpmnJS.get('zoomScroll') as ZoomScroll;
    zoomScroll.reset();
  }

  zoomMais() {
    const zoomScroll = this.bpmnJS.get('zoomScroll') as ZoomScroll;
    zoomScroll.stepZoom(1);
  }
}
