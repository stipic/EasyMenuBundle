<?php

namespace Stipic\EasyMenuBundle\Entity;

class MenuColumn
{
    private $id;

    private $menu;

    private $columnOrder;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMenu(): ?Menu
    {
        return $this->menu;
    }

    public function setMenu(?Menu $menu): self
    {
        $this->menu = $menu;

        return $this;
    }

    public function getColumnOrder(): ?int
    {
        return $this->columnOrder;
    }

    public function setColumnOrder(int $columnOrder): self
    {
        $this->columnOrder = $columnOrder;

        return $this;
    }
}
